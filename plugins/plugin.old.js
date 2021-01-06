const urlParser = require('url');
const formatDistanceToNow = require('date-fns/formatDistanceToNow');
const normalizeUrl = require('normalize-url');
const nb = require('date-fns/locale/nb');
const firebase = require('firebase/app');

const db = firebase.firestore();

const pattern = new RegExp('(https?:\\/\\/)?' // protocol
  + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
  + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
  + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
  + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
  + '(\\#[-a-z\\d_]*)?', 'ig'); // fragment locator

module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(pattern);
    if (matches) {
      matches
        .map((url) => urlParser.parse(normalizeUrl(url, { forceHttps: true, removeDirectoryIndex: true })))
        .forEach(async (url) => {
          try {
            db.collection('url')
              .where('url', '==', url.href)
              .where('channel', '==', message.channel.id)
              .get()
              .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                  const result = querySnapshot.docs[0].data();
                  if (result.user !== message.author.id) {
                    const days = formatDistanceToNow(result.createdAt.toDate(), { includeSeconds: true, locale: nb });
                    message.reply(`old! Denne lenken ble postet av <@${result.user}> for ${days} siden.`);
                  }
                } else if (url.path && url.path !== '/') {
                  db.collection('url').doc(`${message.channel.id}-${url.href.replace(/\//ig, '')}`).set({
                    url: url.href,
                    user: message.author.id,
                    channel: message.channel.id,
                    createdAt: new Date()
                  })
                    .then(() => {
                      console.log('Document successfully written!');
                    })
                    .catch((error) => {
                      console.error('Error writing document: ', error);
                    });
                }
              })
              .catch((error) => {
                console.log('Error getting documents: ', error);
              });
          } catch (err) {
            console.log('old', err);
          }
        });
    }
  });
};
