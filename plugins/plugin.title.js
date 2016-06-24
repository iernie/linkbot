const _ = require('lodash');
const request = require('request');
const ent = require('ent');

function appendProtocolIfMissing(url) {
  if (!url.match(/^[a-zA-Z]+:\/\//)) {
    return `http://${url}`;
  }
  return url;
}

function parseBody(client, to) {
  return (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const contentType = response.headers['content-type'];
      if (contentType !== undefined && contentType.split(';')[0] === 'text/html') {
        const matches = body.match(/<title>\s*(.*?)\s*<\/title>/im)
        if (matches !== null) {
          client.say(to, `>> ${ent.decode(matches[1])}`);
        }
      }
    }
  };
}

module.exports = (client) => {
  const pattern = new RegExp('(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?', 'ig'); // fragment locator

  client.addListener('message', (from, to, message) => {
    const matches = message.match(pattern);
    if (matches !== null) {
      _.map(matches, url => appendProtocolIfMissing(url)).forEach(url => {
        request(url, parseBody(client, to));
      });
    }
  });
};
