const firebase = require('firebase/compat/app');

const db = firebase.firestore();

module.exports = async (channelId) => {
  const doc = await db.collection('mute').doc(channelId).get();
  return doc.exists;
};
