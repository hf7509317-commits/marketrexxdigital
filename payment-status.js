import {json,detail} from "./_lib.js";
export default async function handler(req,res){
 if(req.method!=="GET"){res.setHeader("Allow","GET");return json(res,405,{ok:false,error:"Method not allowed"})}
 try{const id=String(req.query.order_id||"").trim(),amount=Number(req.query.amount);if(!id||!Number.isInteger(amount)||amount<=0)return json(res,400,{ok:false,error:"Parameter tidak valid"});return json(res,200,{ok:true,transaction:await detail(id,amount)})}
 catch(e){return json(res,502,{ok:false,error:e.message||"Gagal mengecek status"})}
}
