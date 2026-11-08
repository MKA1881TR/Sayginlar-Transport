// Ortak menü, TR/ENG dili ve giriş butonu. Her sayfada <script src="site.js"></script> yeterli.
(function(){
  var ml = document.createElement('link'); ml.rel = 'manifest'; ml.href = 'manifest.webmanifest'; document.head.appendChild(ml);
  var lang = localStorage.getItem('lang') || 'tr';
  document.documentElement.dataset.lang = lang;
  // yardımcılar (diğer sayfalar kullanır)
  window.bi = function(a,b){ return '<span class="tr">'+a+'</span><span class="en">'+b+'</span>'; };
  window.T = function(a,b){ return document.documentElement.dataset.lang==='en' ? b : a; };
  window.fmt = function(d){ // saniyesiz tarih-saat
    return d.toLocaleString(T('tr-TR','en-GB'),{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
  };
  window.applyPh = function(){
    document.querySelectorAll('[data-ph-tr]').forEach(function(e){
      e.placeholder = document.documentElement.dataset.lang==='en' ? e.dataset.phEn : e.dataset.phTr;
    });
  };
  var links = [
    ['index.html','Ana Sayfa','Home'],
    ['management.html','Yönetim','Management'],
    ['gallery.html','Galeri','Gallery'],
    ['partnership.html','Ortaklıklar','Partnership'],
    ['duyurular.html','Duyurular','Announcements'],
    ['cerez.html','Çerez Politikası','Cookie Policy'],
    ['panel.html','Yönetim Paneli','Management Panel']
  ];
  var here = location.pathname.split('/').pop() || 'index.html';
  var nav = document.createElement('nav');
  nav.className = 'nav';
  nav.innerHTML = '<a class="brand" href="index.html">Saygınlar Transport</a><ul>' +
    links.map(function(l){
      return '<li><a class="l'+((here||'index').replace('.html','')===l[0].replace('.html','')?' active':'')+'" href="'+l[0]+'">'+bi(l[1],l[2])+'</a></li>';
    }).join('') +
    '<li class="tools"><button class="bell" id="bellbtn" type="button">🔔</button><div class="lang"><span id="bt">TR</span><i></i><span id="be">ENG</span></div>' +
    '<a class="gbtn" id="authbtn" href="giris.html">'+bi('Giriş Yap','Log in')+'</a></li></ul>';
  document.addEventListener('DOMContentLoaded', function(){
    document.body.insertBefore(nav, document.body.firstChild);
    function set(l){
      localStorage.setItem('lang', l);
      document.documentElement.dataset.lang = l;
      document.getElementById('bt').classList.toggle('on', l==='tr');
      document.getElementById('be').classList.toggle('on', l==='en');
      applyPh();
      document.dispatchEvent(new Event('langchange'));
    }
    document.getElementById('bt').onclick = function(){set('tr')};
    document.getElementById('be').onclick = function(){set('en')};
    set(lang);
    // ---- Bildirim zili ----
    var bell = document.getElementById('bellbtn');
    function paintBell(){
      var on = localStorage.getItem('push')==='1' && window.Notification && Notification.permission==='granted';
      bell.classList.toggle('on', !!on);
      bell.title = on ? T('Bildirimler açık (kapatmak için tıkla)','Notifications are on (click to turn off)') : T('Duyuru bildirimlerini aç','Turn on announcement notifications');
    }
    paintBell(); document.addEventListener('langchange', paintBell);
    bell.onclick = function(){
      import('./push.js').then(async function(p){
        var st = await p.pushState();
        if(st==='unsupported'){ alert(T('Bu tarayıcı bildirimleri desteklemiyor. iPhone kullanıyorsan önce siteyi "Ana Ekrana Ekle" ile kurman gerekir.','This browser does not support notifications. On iPhone, add the site to the Home Screen first.')); return; }
        if(st==='denied'){ alert(T('Bildirimler tarayıcıdan engellenmiş. Adres çubuğundaki kilit simgesinden izin ver.','Notifications are blocked. Allow them from the lock icon in the address bar.')); return; }
        if(st==='on'){ if(confirm(T('Bildirimler kapatılsın mı?','Turn notifications off?'))){ await p.disablePush(); paintBell(); } return; }
        try{
          var r = await p.enablePush();
          if(r==='denied') alert(T('Bildirim izni verilmedi.','Notification permission was not granted.'));
          else alert(T('Bildirimler açıldı! 🔔 Yeni duyurular geldiğinde haber alacaksın.','Notifications are on! 🔔 You will be notified about new announcements.'));
        }catch(e){ console.error(e); alert(T('Bildirim servisi şu an kullanılamıyor.','The notification service is not available right now.')); }
        paintBell();
      }).catch(function(e){ console.error(e); alert(T('Bildirim servisi şu an kullanılamıyor.','The notification service is not available right now.')); });
    };
    // ---- Bakım modu: owner açar, yetkili olmayanlar siteyi göremez ----
    var mt = {on:false, until:''}, isStaff = false;
    var exempt = /^giris(\.html)?$/.test(here);   // giriş sayfası açık kalır ki yetkililer girebilsin
    try{ var cc = JSON.parse(localStorage.getItem('mt')||'null'); if(cc && cc.on && localStorage.getItem('mtstaff')!=='1') mt = cc; }catch(e){}
    function mtPaint(){
      var block = mt.on && !isStaff && !exempt;
      document.documentElement.classList.toggle('mt-on', block);
      [].forEach.call(document.body.children, function(c){ if(c.id!=='mtnc' && c.id!=='mtbar') c.inert = block; });
      var o = document.getElementById('mtnc');
      if(block){
        if(!o){ o = document.createElement('div'); o.id = 'mtnc'; document.body.appendChild(o); }
        var t = /^\d{2}:\d{2}$/.test(mt.until) ? mt.until.replace(':','.') : '';
        var cur = document.documentElement.dataset.lang;
        o.innerHTML = '<div class="mt-top"><div class="lang"><span data-l="tr" class="'+(cur==='tr'?'on':'')+'">TR</span><i></i><span data-l="en" class="'+(cur==='en'?'on':'')+'">ENG</span></div>' +
          '<a class="gbtn" href="giris.html">'+bi('Giriş Yap','Log in')+'</a></div>' +
          '<div class="mt-in"><div class="mt-h">'+bi('BAKIMDAYIZ!','UNDER MAINTENANCE!')+'</div>' +
          '<p>'+bi('Sitemiz sizlere daha iyi hizmet verebilmek adına bakımdadır.','Our website is under maintenance to serve you better.')+'</p>' +
          (t ? '<p>'+bi('Tahmini olarak <b>'+t+'</b> saatinde açılacaktır.','It is estimated to reopen at <b>'+t+'</b>.')+'</p>' : '') +
          '<p>'+bi('Anlayışınız için teşekkür ederiz.','Thank you for your understanding.')+'</p></div>';
        [].forEach.call(o.querySelectorAll('[data-l]'), function(b){ b.onclick = function(){ set(b.getAttribute('data-l')); }; });
      } else if(o){ o.remove(); }
      var bar = document.getElementById('mtbar');
      if(mt.on && isStaff){
        if(!bar){ bar = document.createElement('div'); bar.id = 'mtbar';
          bar.innerHTML = bi('🛠 Bakım modu AÇIK — siteyi sadece yetkililer görüyor','🛠 Maintenance mode is ON — only staff can see the site'); document.body.appendChild(bar); }
      } else if(bar){ bar.remove(); }
    }
    mtPaint();
    document.addEventListener('langchange', function(){ if(document.getElementById('mtnc') || document.getElementById('mtbar')) mtPaint(); });

    import('./fb.js').then(function(m){
      // giriş yapılmışsa buton "Çıkış Yap" olur
      m.onAuthStateChanged(m.auth, function(u){
        var b = document.getElementById('authbtn');
        if(u){
          b.innerHTML = bi('Çıkış Yap','Log out'); b.href = '#';
          b.onclick = function(e){ e.preventDefault(); m.signOut(m.auth).then(function(){ location.href='index.html'; }); };
        }
      });
      m.onSnapshot(m.doc(m.db,'settings','maintenance'), function(s){
        var d = s.exists() ? s.data() : {};
        mt = { on: d.on === true, until: typeof d.until === 'string' ? d.until : '' };
        try{ localStorage.setItem('mt', JSON.stringify(mt)); }catch(e){}
        mtPaint();
      }, function(){});
      m.watchRole(function(r){
        isStaff = m.isStaffRole(r);
        try{ localStorage.setItem('mtstaff', isStaff ? '1' : '0'); }catch(e){}
        mtPaint();
      });
    }).catch(function(){});
  });
})();
