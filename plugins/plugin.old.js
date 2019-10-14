const urlParser = require('url');
const formatDistanceToNow = require('date-fns/formatDistanceToNow');
const normalizeUrl = require('normalize-url');
const nb = require('date-fns/locale/nb');

const URL = Parse.Object.extend('URL');

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
            const query = new Parse.Query(URL);
            query.equalTo('url', url.href);
            query.equalTo('channel', message.channel.id);
            const result = await query.first();
            if (result) {
              if (result.get('user') !== message.author.id) {
                const days = formatDistanceToNow(result.get('createdAt'), { includeSeconds: true, locale: nb });
                message.reply(`old! Denne lenken ble postet av <@${result.get('user')}> for ${days} siden.`);
              }
            } else if (url.path && url.path !== '/') {
              const urlObject = new URL();
              urlObject.set('url', url.href);
              urlObject.set('user', message.author.id);
              urlObject.set('channel', message.channel.id);
              urlObject.save();
            }
          } catch (err) {
            console.log('old', err);
          }
        });
    }
  });
};
