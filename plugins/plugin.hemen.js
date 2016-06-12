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
  client.addListener('message', (from, to, message) => {
    if (message.match(/^!hemen/)) {
      let queryParam = '';
      const matches = message.match(/^(\S+)\s(.*)/);
      if (matches !== null) {
        const query = matches.splice(1);
        if (query !== null && query.length > 0 && query[1] !== null && query[1].trim() !== '') {
          queryParam = `search?q=${query[1].trim()}`;
        }
      }
      request(`http://hemmis.444.no/hemensier/${queryParam}`, parseBodyFunction(client, to));
    }
  });
};
