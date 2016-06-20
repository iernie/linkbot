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
    const matches = message.match(/^!giphy (\S.*)/i);
    if (matches !== null) {
      request(`http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${matches[1].trim().replace(/ /g, '+')}`, parseBody(client, to));
    }
  });
};
