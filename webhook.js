import {json,detail,telegram} from "./_lib.js";
export default async function handler(req,res){
 if(req.method!=="POST"){res.setHeader("Allow","POST");return json(res,405,{ok:false,error:"Method not allowed"})}
 try{
  const b=typeof req.body==="string"?JSON.parse(req.body):(req.body||{}),id=String(b.order_id||"").trim(),amount=Number(b.amount),project=String(b.project||"").trim();
  if(!id||!Number.isInteger(amount)||amount<=0)return json(res,400,{ok:false,error:"Webhook payload tidak valid"});
  if(project&&process.env.PAKASIR_PROJECT&&project!==process.env.PAKASIR_PROJECT)return json(res,400,{ok:false,error:"Project tidak cocok"});
  const t=await detail(id,amount);
  if(t.status==="completed")try{await telegram(["REXX MARKET — PEMBAYARAN BERHASIL","",`Order ID: ${t.order_id}`,`Nominal: Rp ${Number(t.amount).toLocaleString("id-ID")}`,`Metode: ${(t.payment_method||"qris").toUpperCase()}`,`Status: ${t.status.toUpperCase()}`,`Waktu: ${t.completed_at||"-"}`].join("\n"))}catch(e){console.error(e.message)}
  return json(res,200,{ok:true,received:true,transaction:t})
 }catch(e){return json(res,502,{ok:false,error:e.message||"Webhook gagal"})}
}
