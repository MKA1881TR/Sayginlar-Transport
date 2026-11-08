// Türkçe -> İngilizce otomatik çeviri (panelde kullanılır).
// 1) Chrome'un kendi çeviri özelliği (cihazda çalışır, ücretsiz, sınırsız; ilk kullanımda küçük bir dil paketi indirir)
// 2) Olmazsa ücretsiz MyMemory servisi (günlük sınırı var)
const enc = new TextEncoder();
const bytes = s => enc.encode(s).length;

function chunks(text, max){ // MyMemory istek başına ~500 bayt kabul eder
  const out = []; let cur = '';
  const push = s => { if(cur && bytes(cur + s) > max){ out.push(cur.trim()); cur = ''; } cur += s; };
  for(const sent of (text.match(/[^.!?]+[.!?]*\s*/g) || [text])){
    if(bytes(sent) <= max){ push(sent); continue; }
    for(const w of sent.split(/(?<=\s)/)) push(w);
  }
  if(cur.trim()) out.push(cur.trim());
  return out;
}
function decode(s){ const t = document.createElement('textarea'); t.innerHTML = s; return t.value; }

async function myMemory(s){
  const out = [];
  for(const p of chunks(s, 450)){
    const r = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(p) + '&langpair=tr|en');
    if(!r.ok) throw new Error('çeviri servisi ' + r.status);
    const j = await r.json();
    const txt = (j.responseData && j.responseData.translatedText) || '';
    if(Number(j.responseStatus) !== 200 || /MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(txt))
      throw new Error('çeviri servisi: ' + (j.responseDetails || j.responseStatus));
    out.push(decode(txt));
  }
  return out.join(' ');
}

let builtin; // undefined = henüz denenmedi, null = yok
async function getBuiltin(onStatus){
  if(builtin !== undefined) return builtin;
  builtin = null;
  if('Translator' in self){
    try{
      const a = await Translator.availability({sourceLanguage:'tr', targetLanguage:'en'});
      if(a !== 'unavailable'){
        const t = await Translator.create({sourceLanguage:'tr', targetLanguage:'en',
          monitor(m){ m.addEventListener('downloadprogress', e => onStatus && onStatus(Math.round(e.loaded * 100) + '%')); }});
        builtin = s => t.translate(s);
      }
    }catch(e){ console.warn('Chrome çeviri kullanılamadı', e); }
  }
  return builtin;
}

async function oneLine(s, onStatus){
  const b = await getBuiltin(onStatus);
  if(b){ try{ return await b(s); }catch(e){ console.warn(e); } }
  return await myMemory(s);
}

// Paragraf yapısını koruyarak çevirir
export async function translateTrEn(text, onStatus){
  const out = [];
  for(const line of text.split('\n')) out.push(line.trim() ? await oneLine(line, onStatus) : '');
  return out.join('\n');
}
