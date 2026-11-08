// Bildirim aç/kapat. Sadece zil butonuna basılınca yüklenir.
import {firebaseApp} from "./fb.js";
import {getMessaging,getToken,deleteToken,isSupported} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";
import * as cfg from "./firebase-config.js";

export async function pushState(){
  try{ if(!(await isSupported())) return 'unsupported'; }catch(e){ return 'unsupported'; }
  if(Notification.permission==='denied') return 'denied';
  return (Notification.permission==='granted' && localStorage.getItem('push')==='1') ? 'on' : 'off';
}
export async function enablePush(){
  if(!cfg.VAPID_KEY || !cfg.firebaseConfig.messagingSenderId) throw new Error('config');
  const perm = await Notification.requestPermission();
  if(perm!=='granted') return 'denied';
  const c = cfg.firebaseConfig;
  const q = new URLSearchParams({apiKey:c.apiKey,projectId:c.projectId,messagingSenderId:c.messagingSenderId,appId:c.appId});
  const reg = await navigator.serviceWorker.register('firebase-messaging-sw.js?'+q.toString());
  await navigator.serviceWorker.ready;
  const token = await getToken(getMessaging(firebaseApp),{vapidKey:cfg.VAPID_KEY,serviceWorkerRegistration:reg});
  if(!token) throw new Error('token');
  const r = await fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token})});
  if(!r.ok){ let d=''; try{ const j=await r.json(); d=j.detail||j.error||''; }catch(_){} throw new Error('api '+r.status+(d?': '+d:'')); }
  localStorage.setItem('push','1'); localStorage.setItem('pushtoken',token);
  return 'on';
}
export async function disablePush(){
  const token = localStorage.getItem('pushtoken');
  try{
    if(token) await fetch('/api/unsubscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token})});
    await deleteToken(getMessaging(firebaseApp));
  }catch(e){ console.error(e); }
  localStorage.removeItem('push'); localStorage.removeItem('pushtoken');
  return 'off';
}
