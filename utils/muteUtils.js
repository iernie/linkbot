const admin = require('firebase-admin');

const db = admin.database();

module.exports = async (channelId) => {
  const doc = await db.collection('mute').doc(channelId).get();
  return doc.exists;
};
