// Ortak menü + TR/ENG dili. Her sayfada <script src="site.js"></script> yeterli.
(function(){
  var lang = localStorage.getItem('lang') || 'tr';
  document.documentElement.dataset.lang = lang;
  var links = [
    ['panel.html','Management Panel','Management Panel'],
    ['cerez.html','Çerez Politikası','Cookie Policy'],
    ['duyurular.html','Duyurular','Announcements'],
    ['partnership.html','Partnership','Partnership'],
    ['gallery.html','Gallery','Gallery'],
    ['management.html','Management','Management'],
    ['index.html','Ana Sayfa','Home']
  ];
  var here = location.pathname.split('/').pop() || 'index.html';
  var nav = document.createElement('nav');
  nav.className = 'nav';
  nav.innerHTML = '<a class="brand" href="index.html">Saygınlar Transport</a><ul>' +
    links.map(function(l){
      return '<li><a class="l'+(here===l[0]?' active':'')+'" href="'+l[0]+'"><span class="tr">'+l[1]+'</span><span class="en">'+l[2]+'</span></a></li>';
    }).join('') +
    '<li><div class="lang"><span id="bt">TR</span><i></i><span id="be">ENG</span></div></li></ul>';
  document.addEventListener('DOMContentLoaded', function(){
    document.body.insertBefore(nav, document.body.firstChild);
    function set(l){
      localStorage.setItem('lang', l);
      document.documentElement.dataset.lang = l;
      document.getElementById('bt').classList.toggle('on', l==='tr');
      document.getElementById('be').classList.toggle('on', l==='en');
      document.dispatchEvent(new Event('langchange'));
    }
    document.getElementById('bt').onclick = function(){set('tr')};
    document.getElementById('be').onclick = function(){set('en')};
    set(lang);
  });
})();
