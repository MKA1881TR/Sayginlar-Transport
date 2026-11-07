// Ana sayfanın sağ alt köşesinde son duyuruları canlı gösterir.
// Kendi index.html'ine eklemek için: <script type="module" src="duyuru-widget.js"></script>
import {db,collection,query,orderBy,limit,onSnapshot} from "./fb.js";
const box=document.createElement('div');box.className='wd';box.style.display='none';
box.innerHTML='<div class="wd-h"><span>📢 '+bi('Son Duyurular','Latest Announcements')+'</span><span id="wd-t">▾</span></div><div class="wd-b" id="wd-b"></div>';
document.body.append(box);
const body=box.querySelector('#wd-b'),tog=box.querySelector('#wd-t');
let closed=false;try{closed=localStorage.getItem('wd')==='0';}catch(e){}
function paint(){body.style.display=closed?'none':'block';tog.textContent=closed?'▴':'▾';}
box.querySelector('.wd-h').onclick=()=>{closed=!closed;try{localStorage.setItem('wd',closed?'0':'1');}catch(e){}paint();};
let items=[];
function render(){
  body.innerHTML='';
  items.forEach(a=>{
    const d=document.createElement('div');d.className='wd-i';
    const t=document.createElement('b');t.textContent=a.title;
    const s=document.createElement('div');const sm=document.createElement('small');sm.textContent=a.createdAt?fmt(a.createdAt.toDate()):'';s.append(sm);
    const p=document.createElement('p');p.textContent=a.content.length>140?a.content.slice(0,140)+'…':a.content;
    d.append(t,s,p);
    if(a.imageUrl&&/^(https:\/\/|data:image\/jpeg;base64,)/.test(a.imageUrl)){const i=document.createElement('img');i.src=a.imageUrl;i.alt='';i.loading='lazy';d.append(i);}
    body.append(d);
  });
  const l=document.createElement('div');l.style.paddingTop='8px';l.innerHTML='<a href="duyurular.html">'+bi('Tümünü gör →','See all →')+'</a>';body.append(l);
}
paint();
document.addEventListener('langchange',render);
onSnapshot(query(collection(db,'announcements'),orderBy('createdAt','desc'),limit(3)),snap=>{
  items=snap.docs.map(d=>d.data());
  box.style.display=items.length?'block':'none';
  render();
},()=>{box.style.display='none';});
