// Koda gömülü eski kartları (galeri / partner / kadro) veritabanına aktarır, böylece düzenlenip silinebilir.
import {db,doc,getDoc,setDoc,serverTimestamp} from "./fb.js";
export async function isSeeded(k){
  try{ return (await getDoc(doc(db,'settings','seed_'+k))).exists(); }catch(e){ return false; }
}
export async function runSeed(k, items){
  await Promise.all(items.map(async it=>{
    const ref=doc(db,k,it.id);
    if((await getDoc(ref)).exists()) return;
    await setDoc(ref,{...it.data,createdAt:serverTimestamp()});
  }));
  await setDoc(doc(db,'settings','seed_'+k),{done:true,at:serverTimestamp()});
}
export const ord=p=>typeof p.order==='number'?p.order:(p.createdAt&&p.createdAt.toMillis?p.createdAt.toMillis():0);
