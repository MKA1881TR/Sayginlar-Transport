// Duyuru yayınlanınca panelden çağrılır. Sadece editor/admin/owner gönderebilir (sunucuda doğrulanır).
const getAdmin = require('../lib/admin');
module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).json({error:'method'});
  try{
    const admin = getAdmin();
    const h = req.headers.authorization || '';
    const idToken = h.startsWith('Bearer ') ? h.slice(7) : '';
    if(!idToken) return res.status(401).json({error:'login'});
    const decoded = await admin.auth().verifyIdToken(idToken);
    const snap = await admin.firestore().doc('users/' + decoded.uid).get();
    const role = snap.exists ? snap.data().role : 'user';
    if(!['editor','admin','owner'].includes(role)) return res.status(403).json({error:'forbidden'});

    const { title, body, imageUrl } = req.body || {};
    if(typeof title !== 'string' || !title.trim()) return res.status(400).json({error:'title'});
    const site = process.env.SITE_URL || ('https://' + req.headers.host);
    const msg = {
      topic: 'announcements',
      notification: { title: title.trim().slice(0, 100), body: String(body || '').slice(0, 180) },
      webpush: { fcmOptions: { link: site + '/duyurular.html' }, notification: { icon: site + '/icon-192.png' } }
    };
    if(typeof imageUrl === 'string' && /^https:\/\//.test(imageUrl) && imageUrl.length <= 500) msg.notification.imageUrl = imageUrl;
    await admin.messaging().send(msg);
    res.json({ok:true});
  }catch(e){ console.error(e); res.status(500).json({error:'server'}); }
};
