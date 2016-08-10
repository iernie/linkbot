const request = require('request');
const ent = require('ent');

function parseBodyFunction(client, to) {
  return (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const contentType = response.headers['content-type'];
      if (contentType.split(';')[0] === 'text/html') {
        client.say(to, ent.decode(body));
      }
    }
  };
}

module.exports = (client) => {
  client.addListener('pm', (from, message) => {
    let queryParam = '';
    const matches = message.match(/^(!hemen)( \S.*)?/i);
    if (matches !== null) {
      if (matches[2] !== undefined) {
        queryParam = `search?q=${matches[2].trim()}`;
      }
      request(`http://hemmis.444.no/hemensier/${queryParam}`, parseBodyFunction(client, from));
    }
  });
};
