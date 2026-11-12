// Owner'ın iletişim bilgilerini düzenlediği pencere. Kaydedince tüm sitedeki linkler kendiliğinden güncellenir.
import {db,doc,setDoc,serverTimestamp} from "./fb.js";

const FIELDS = ['instagram','youtube','website','discord','tmp','email'];
const LABELS = {
  instagram: () => 'Instagram',
  youtube:   () => 'YouTube',
  website:   () => 'Website',
  discord:   () => 'Discord',
  tmp:       () => bi('TruckersMP başvuru linki (ana sayfadaki buton)','TruckersMP application link (home page button)'),
  email:     () => bi('E-posta','Email')
};

export function openContactEditor(cur, defs){
  cur = cur || {}; defs = defs || {};
  const el = document.createElement('div'); el.className = 'mbg'; el.style.display = 'flex';
  const box = document.createElement('div'); box.className = 'mbox';
  box.style.cssText = 'max-width:520px;text-align:left;max-height:92vh;overflow:auto';
  const x = document.createElement('button'); x.type = 'button'; x.className = 'mx'; x.textContent = '✕';
  const h = document.createElement('h2'); h.innerHTML = '✎ ' + bi('İletişim Bilgileri','Contact Info');
  const p = document.createElement('p'); p.style.cssText = 'color:#888;font-size:13px;line-height:1.5';
  p.innerHTML = bi('Burada değiştirdiğin linkler ve e-posta tüm sitede (alt bilgi, Hakkımızda, yasal sayfalar, ana sayfa butonları) kendiliğinden güncellenir. Boş bırakırsan varsayılan kullanılır. Linkler https:// ile başlamalı.',
                   'Links and the email you change here update automatically across the whole site (footer, About, legal pages, home page buttons). Leave a field empty to use the default. Links must start with https://');
  box.append(x, h, p);
  const inputs = {};
  FIELDS.forEach(k => {
    const l = document.createElement('label'); l.style.cssText = 'color:#aaa;font-size:13px;display:block;margin-top:6px'; l.innerHTML = LABELS[k]();
    const i = document.createElement('input'); i.type = k === 'email' ? 'email' : 'text'; i.maxLength = 300;
    i.value = cur[k] || ''; i.placeholder = defs[k] || 'https://...';
    inputs[k] = i; box.append(l, i);
  });
  const msg = document.createElement('div');
  const note = (t, err) => { msg.innerHTML = ''; const d = document.createElement('div'); d.className = 'msg' + (err ? ' err' : ''); d.textContent = t; msg.append(d); };
  const row = document.createElement('div'); row.className = 'mrow';
  const save = document.createElement('button'); save.type = 'button'; save.className = 'btn'; save.innerHTML = bi('KAYDET','SAVE');
  const cancel = document.createElement('button'); cancel.type = 'button'; cancel.className = 'btn gray'; cancel.innerHTML = bi('VAZGEÇ','CANCEL');
  row.append(save, cancel); box.append(row, msg); el.append(box); document.body.append(el);

  const close = () => el.remove();
  x.onclick = cancel.onclick = close;
  el.onclick = e => { if(e.target === el) close(); };

  save.onclick = async () => {
    const vals = {};
    FIELDS.forEach(k => vals[k] = inputs[k].value.trim());
    for(const k of ['instagram','youtube','website','discord','tmp']){
      if(vals[k] && !/^https:\/\/\S+$/i.test(vals[k])){ note(T('Linkler https:// ile başlamalı ve boşluk içermemeli: ','Links must start with https:// and contain no spaces: ') + k, true); return; }
    }
    if(vals.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(vals.email)){ note(T('Geçerli bir e-posta adresi gir.','Enter a valid email address.'), true); return; }
    save.disabled = true;
    try{
      await setDoc(doc(db,'settings','contact'), {...vals, updatedAt: serverTimestamp()});
      note(T('Kaydedildi. Tüm sitede güncellendi.','Saved. Updated across the whole site.'));
      setTimeout(close, 900);
    }catch(e){
      console.error(e); save.disabled = false;
      note(T('Kaydedilemedi (yetkin yok ya da Firestore kuralları güncel değil).','Could not save (no permission, or the Firestore rules are not up to date).'), true);
    }
  };
}
