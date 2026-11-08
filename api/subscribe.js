const getAdmin = require('../lib/admin');
module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).json({error:'method'});
  try{
    const token = (req.body && req.body.token) || '';
    if(typeof token !== 'string' || token.length < 50 || token.length > 400) return res.status(400).json({error:'token'});
    await getAdmin().messaging().subscribeToTopic(token, 'announcements');
    res.json({ok:true});
  }catch(e){ console.error(e); res.status(500).json({error:'server'}); }
};
