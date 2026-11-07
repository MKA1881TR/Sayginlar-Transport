// Sürükle-bırak fotoğraf yükleme. Fotoğraf tarayıcıda küçültülüp JPEG olarak veritabanına yazılır (ücretsiz).
const MAX_CHARS = 850000; // Firestore belge sınırı 1 MB, güvenli pay bırakıldı
function toDataUrl(file, maxW){
  return new Promise((res, rej) => {
    if(!file || !/^image\//.test(file.type)) return rej(new Error('type'));
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      let w = img.width, h = img.height;
      let sc = Math.min(1, maxW / w); w = Math.round(w*sc); h = Math.round(h*sc);
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0,0,w,h); x.drawImage(img,0,0,w,h);
      let q = 0.85, d;
      do { d = c.toDataURL('image/jpeg', q); q -= 0.1; } while(d.length > MAX_CHARS && q > 0.25);
      URL.revokeObjectURL(url);
      d.length > MAX_CHARS ? rej(new Error('big')) : res(d);
    };
    img.onerror = () => rej(new Error('load'));
    img.src = url;
  });
}
export function makeDrop(host, maxW){
  let data = '';
  host.className = 'drop';
  host.innerHTML = '<div class="dt">'+bi('📷 Fotoğrafı buraya sürükle ya da tıkla','📷 Drag a photo here or click')+'</div><img style="display:none" alt=""><input type="file" accept="image/*" style="display:none">';
  const dt = host.querySelector('.dt'), prev = host.querySelector('img'), inp = host.querySelector('input');
  async function take(file){
    try{
      data = await toDataUrl(file, maxW);
      prev.src = data; prev.style.display = 'block';
      dt.innerHTML = bi('✔ Fotoğraf hazır (değiştirmek için tekrar sürükle)','✔ Photo ready (drag another to replace)');
    }catch(e){
      data = ''; prev.style.display = 'none';
      dt.textContent = e.message==='type' ? T('Sadece resim dosyası (png/jpg) bırak.','Drop an image file (png/jpg) only.')
                                         : T('Fotoğraf okunamadı ya da çok büyük.','Could not read the photo or it is too large.');
    }
  }
  host.onclick = () => inp.click();
  inp.onchange = () => { if(inp.files[0]) take(inp.files[0]); };
  host.ondragover = e => { e.preventDefault(); host.classList.add('over'); };
  host.ondragleave = () => host.classList.remove('over');
  host.ondrop = e => { e.preventDefault(); host.classList.remove('over'); if(e.dataTransfer.files[0]) take(e.dataTransfer.files[0]); };
  return {
    getData: () => data,
    clear: () => { data=''; prev.style.display='none'; inp.value=''; dt.innerHTML = bi('📷 Fotoğrafı buraya sürükle ya da tıkla','📷 Drag a photo here or click'); }
  };
}
