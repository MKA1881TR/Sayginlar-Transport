// Ana sayfada açılan resimli kısa duyuru penceresi (popup). Owner panelden açıp kapatır.
import {db,doc,onSnapshot} from "./fb.js";

let el = null, cur = null;
const txt = d => T(d.text || '', d.textEn || d.text || '');
function remove(){ if(el){ el.remove(); el = null; } }

export function showPopup(d, opts){
  opts = opts || {};
  remove(); cur = d;
  el = document.createElement('div'); el.className = 'pbg';
  const box = document.createElement('div'); box.className = 'pbox';
  const x = document.createElement('button'); x.type = 'button'; x.className = 'pclose'; x.textContent = '×'; x.setAttribute('aria-label','Close');
  box.append(x);
  if(d.imageUrl && /^(https:\/\/|data:image\/jpeg;base64,)/.test(d.imageUrl)){
    const i = document.createElement('img'); i.className = 'pimg'; i.src = d.imageUrl; i.alt = ''; box.append(i);
  }
  const bar = document.createElement('div'); bar.className = 'pbar';
  const t = document.createElement('span'); t.className = 'ptxt'; t.textContent = txt(d);
  const hide = document.createElement('button'); hide.type = 'button'; hide.className = 'btn small';
  hide.innerHTML = bi('Tekrar gösterme', "Don't show again");
  bar.append(t, hide); box.append(bar); el.append(box); document.body.append(el);
  // X: bu oturumda bir daha açma. "Tekrar gösterme": bu popup'ı bir daha hiç gösterme.
  const close = () => { if(!opts.preview){ try{ sessionStorage.setItem('popupClosed', String(d.v)); }catch(e){} } remove(); };
  x.onclick = close;
  el.onclick = e => { if(e.target === el) close(); };
  hide.onclick = () => { if(!opts.preview){ try{ localStorage.setItem('popupHide', String(d.v)); }catch(e){} } remove(); };
}
document.addEventListener('keydown', e => { if(e.key === 'Escape' && el){ const b = el.querySelector('.pclose'); if(b) b.click(); } });
document.addEventListener('langchange', () => { if(el && cur){ const t = el.querySelector('.ptxt'); if(t) t.textContent = txt(cur); } });

export function startPopup(){
  let timer = null;
  onSnapshot(doc(db, 'settings', 'popup'), s => {
    clearTimeout(timer);
    const d = s.exists() ? s.data() : null;
    remove();
    if(!d || d.on !== true || (!d.text && !d.imageUrl)) return;
    try{
      if(localStorage.getItem('popupHide') === String(d.v) || sessionStorage.getItem('popupClosed') === String(d.v)) return;
    }catch(e){}
    timer = setTimeout(() => { if(!document.documentElement.classList.contains('mt-on')) showPopup(d); }, 700);
  }, () => {});
}
