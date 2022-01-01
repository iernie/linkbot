const firebase = require('firebase/compat/app');

const db = firebase.firestore();

module.exports = (client) => {
  client.on('message', async (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(/!mute #?(\S+)/i);
    if (matches) {
      const channel = client.channels.cache.find('name', matches[1]);

      if (channel) {
        db.collection('mute')
          .doc(channel.id)
          .get()
          .then((doc) => {
            if (doc.exists) {
              db.collection('mute').doc(channel.id).delete().then(() => {
                console.log('Document successfully deleted!');
              })
                .catch((error) => {
                  console.error('Error removing document: ', error);
                });
              message.react('🔊');
            } else {
              db.collection('mute').doc(channel.id).set({
                channel: channel.id,
                createdAt: new Date()
              })
                .then(() => {
                  console.log('Document successfully written!');
                })
                .catch((error) => {
                  console.error('Error writing document: ', error);
                });
              message.react('🔇');
            }
          })
          .catch((error) => {
            console.log('Error getting documents: ', error);
          });
      }
    }
  });
};
