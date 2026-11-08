// Tarayıcı kapalıyken/arka plandayken gelen bildirimleri gösterir.
// Ayarlar, kaydı yapan push.js tarafından adres sonuna eklenir (?apiKey=...), ayrıca dosya düzenlemeye gerek yok.
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
const p = new URL(self.location.href).searchParams;
firebase.initializeApp({
  apiKey: p.get('apiKey'),
  projectId: p.get('projectId'),
  messagingSenderId: p.get('messagingSenderId'),
  appId: p.get('appId')
});
firebase.messaging(); // notification içeren mesajları otomatik gösterir ve tıklanınca duyurular sayfasını açar
