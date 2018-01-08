const _ = require('lodash');
const request = require('request');
const ent = require('ent');
const urlParser = require('url');

function appendProtocolIfMissing(url) {
  if (!url.match(/^[a-zA-Z]+:\/\//)) {
    return `http://${url}`;
  }
  return url;
}

function parseBody(bot, channelID) {
  return (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const contentType = response.headers['content-type'];
      if (contentType !== undefined && contentType.split(';')[0] === 'text/html') {
        const matches = body.match(/<title>\s*(.*?)\s*<\/title>/im);
        if (matches !== null) {
          bot.sendMessage({
            to: channelID,
            message: `>> ${ent.decode(matches[1])}`
          });
        }
      }
    }
  };
}

module.exports = (bot) => {
  const pattern = new RegExp('(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?', 'ig'); // fragment locator

  bot.on('message', (user, userID, channelID, message) => {
    if (user === bot.username) return;
    const matches = message.match(pattern);
    if (matches !== null) {
      _.map(matches, url => urlParser.parse(appendProtocolIfMissing(url))).forEach((url) => {
        if (url.href !== '') {
          request(url.href, parseBody(bot, channelID));
        }
      });
    }
  });
};
