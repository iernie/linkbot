const request = require('request');
const ent = require('ent');

function isURL(str) {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
  '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return pattern.test(str);
}

function appendProtocolIfMissing(str) {
  if (!str.match(/^[a-zA-Z]+:\/\//)) {
    return `http://${str}`;
  }
  return str;
}

function getTitle(str) {
  return str.match(/<title>\s*(.*?)\s*<\/title>/im);
}

function parseBody(client, to) {
  return (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const contentType = response.headers['content-type'];
      if (contentType !== undefined && contentType.split(';')[0] === 'text/html') {
        const matches = getTitle(body);
        if (matches !== null) {
          const title = matches[1];
          client.say(to, `>> ${ent.decode(title)}`);
        }
      }
    }
  };
}

module.exports = (client) => {
  client.addListener('message', (from, to, message) => {
    const splitMessages = message.split(' ');
    splitMessages.forEach(splitMessage => {
      if (isURL(splitMessage)) {
        const url = appendProtocolIfMissing(splitMessage);
        request(url, parseBody(client, to));
      }
    });
  });
};
