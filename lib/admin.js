// Firebase Admin (sunucu tarafı). Servis hesabı anahtarı SADECE Vercel ortam değişkeninde durur, kodda değil.
const admin = require('firebase-admin');
module.exports = function getAdmin(){
  if(!admin.apps.length){
    const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(sa) });
  }
  return admin;
};
