// Mevcut Apps Script projene EKLE. doGet(e) fonksiyonunun EN BAŞINA şu bloğu koy:
//
//   if (e.parameter.sheet === 'Basvurular') {
//     var mail = firebaseEmail_(e.parameter.token);
//     if (!mail || ADMINS.indexOf(mail.toLowerCase()) < 0) {
//       return ContentService.createTextOutput(JSON.stringify({error:'yetkisiz'}))
//         .setMimeType(ContentService.MimeType.JSON);
//     }
//   }
//
// Sonra: Dağıt > Dağıtımları yönet > düzenle > Yeni sürüm > Dağıt (adres aynı kalır).

var FIREBASE_API_KEY = 'BURAYA_FIREBASE_API_KEY';
var ADMINS = ['senin-admin-mailin@gmail.com']; // başvuruları görebilecek hesaplar (küçük harf)

function firebaseEmail_(token) {
  if (!token) return null;
  try {
    var r = UrlFetchApp.fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + FIREBASE_API_KEY, {
      method: 'post', contentType: 'application/json',
      payload: JSON.stringify({ idToken: token }), muteHttpExceptions: true
    });
    var u = JSON.parse(r.getContentText()).users;
    return u && u[0] ? u[0].email : null;
  } catch (err) { return null; }
}
