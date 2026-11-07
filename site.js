// Ortak menü, TR/ENG dili ve giriş butonu. Her sayfada <script src="site.js"></script> yeterli.
(function(){
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
    ['management.html','Management','Management'],
    ['gallery.html','Gallery','Gallery'],
    ['partnership.html','Partnership','Partnership'],
    ['duyurular.html','Duyurular','Announcements'],
    ['cerez.html','Çerez Politikası','Cookie Policy'],
    ['panel.html','Management Panel','Management Panel']
  ];
  var here = location.pathname.split('/').pop() || 'index.html';
  var nav = document.createElement('nav');
  nav.className = 'nav';
  nav.innerHTML = '<a class="brand" href="index.html">Saygınlar Transport</a><ul>' +
    links.map(function(l){
      return '<li><a class="l'+(here===l[0]?' active':'')+'" href="'+l[0]+'">'+bi(l[1],l[2])+'</a></li>';
    }).join('') +
    '<li class="tools"><div class="lang"><span id="bt">TR</span><i></i><span id="be">ENG</span></div>' +
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
    // giriş yapılmışsa buton "Çıkış Yap" olur
    import('./fb.js').then(function(m){
      m.onAuthStateChanged(m.auth, function(u){
        var b = document.getElementById('authbtn');
        if(u){
          b.innerHTML = bi('Çıkış Yap','Log out'); b.href = '#';
          b.onclick = function(e){ e.preventDefault(); m.signOut(m.auth).then(function(){ location.href='index.html'; }); };
        }
      });
    }).catch(function(){});
  });
})();
