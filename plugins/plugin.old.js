const urlParser = require('url');

const URL = Parse.Object.extend('URL');

function appendProtocolIfMissing(url) {
  if (!url.match(/^https?:\/\//)) {
    return `http://${url}`;
  }
  return url;
}

const pattern = new RegExp('(https?:\\/\\/)?' + // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
  '(\\#[-a-z\\d_]*)?', 'ig'); // fragment locator

module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(pattern);
    if (matches) {
      matches
      .map(url => urlParser.parse(appendProtocolIfMissing(url)))
      .forEach(async (url) => {
        const query = new Parse.Query(URL);
        query.equalTo('url', url.href.toLowerCase());
        query.equalTo('channel', message.channel.id);
        query.notEqualTo('user', message.author.id);
        const result = await query.find();
        console.log(result);
        if (result && result.length > 0) {
          result.forEach((res) => {
            message.reply(`@${message.author.id}, old! Denne lenken ble postet av ${client.users.get(res.user).username} for ${0} ${0} siden.`);
          });
        } else {
          const urlObject = new URL();
          urlObject.set('url', url.href.toLowerCase());
          urlObject.set('user', message.author.id);
          urlObject.set('channel', message.channel.id);
          urlObject.save();
        }
      });
    }
  });
};
