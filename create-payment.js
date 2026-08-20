import {getProduct} from "../config/products.js";
import {json,orderId,createQris,telegram,text} from "./_lib.js";
export default async function handler(req,res){
 if(req.method!=="POST"){res.setHeader("Allow","POST");return json(res,405,{ok:false,error:"Method not allowed"})}
 try{
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{}),p=getProduct(text(b.productId,60));
  if(!p)return json(res,400,{ok:false,error:"Produk tidak ditemukan"});
  const c={name:text(b.name,80),email:text(b.email,120),username:text(b.username,80),phone:text(b.phone,40),note:text(b.note,300)};
  if(!c.name||!c.email||!c.username)return json(res,400,{ok:false,error:"Nama, Gmail, dan username wajib diisi"});
  const id=orderId(),pay=await createQris(id,p.price);
  try{await telegram(["REXX MARKET — ORDER BARU","",`Order ID: ${id}`,`Produk: ${p.name}`,`Harga: Rp ${p.price.toLocaleString("id-ID")}`,"",`Nama: ${c.name}`,`Email: ${c.email}`,`Username: ${c.username}`,`No. HP: ${c.phone||"-"}`,`Catatan: ${c.note||"-"}`,"","Status: MENUNGGU PEMBAYARAN"].join("\n"))}catch(e){console.error(e.message)}
  return json(res,200,{ok:true,order_id:id,product:p,payment:{amount:pay.amount,total_payment:pay.total_payment,payment_method:pay.payment_method,payment_number:pay.payment_number,expired_at:pay.expired_at,qr_data_url:pay.qr_data_url}})
 }catch(e){console.error(e);return json(res,e.code==="CONFIG_MISSING"?500:502,{ok:false,error:e.message||"Gagal membuat pembayaran"})}
}
