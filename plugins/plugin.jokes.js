const request = require('request');
const ent = require('ent');

function parseBodyFunction(client, to) {
  return (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const contentType = response.headers['content-type'];
      if (contentType.split(';')[0] === 'application/json') {
        const json = JSON.parse(body);
        if (json.type === "success") {
          client.say(to, ent.decode(json.value.joke).replace(/  /g, ' '));
        }
      }
    }
  };
}

module.exports = (client) => {
  client.addListener('message', (from, to, message) => {
    let queryParam = '';
    const matches = message.match(/^(!joke)( \S.*)?/i);
    if (matches !== null) {
      if (matches[2] !== undefined) {
        queryParam = `?firstName=${matches[2].trim()}&lastName=`;
      }
      request(`https://api.icndb.com/jokes/random${queryParam}`, parseBodyFunction(client, to));
    }
  });
};
