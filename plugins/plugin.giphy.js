const request = require('request');

function parseBody(client, to) {
  return (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const contentType = response.headers['content-type'];
      if (contentType.split(';')[0] === 'application/json') {
        const json = JSON.parse(body);
        if (json.data.length !== 0) {
          client.say(to, json.data.image_original_url);
        }
      }
    }
  };
}

module.exports = (client) => {
  client.addListener('message', (from, to, message) => {
    if (message.match(/^!giphy /)) {
      const matches = message.match(/^(\S+)\s(.*)/);
      if (matches !== null) {
        const query = matches.splice(1);
        if (query !== null && query.length > 0 && query[1] !== null && query[1].trim() !== '') {
          request(`http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${query[1].trim().replace(/ /g, '+')}`, parseBody(client, to));
        }
      }
    }
  });
};
