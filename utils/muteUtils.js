const firebase = require('firebase/app');

const db = firebase.firestore();

module.exports = async (channelId) => {
  const doc = await db.collection('mute').doc(channelId).get();
  return doc.exists;
};
