// Panelden başvuru listesi kaldırıldı, o yüzden Apps Script'in başvuruları internete açması gerekmiyor.
// Apps Script projende doGet(e) fonksiyonunun EN BAŞINA şu bloğu ekle:
//
//   if (e && e.parameter && e.parameter.sheet === 'Basvurular') {
//     return ContentService.createTextOutput(JSON.stringify({error: 'kapali'}))
//       .setMimeType(ContentService.MimeType.JSON);
//   }
//
// Sonra: Dağıt > Dağıtımları yönet > kalem simgesi > Yeni sürüm > Dağıt (adres aynı kalır).
// Başvuruları artık doğrudan Google E-Tablolar'dan görürsün. Başvuru formu (POST) etkilenmez.
