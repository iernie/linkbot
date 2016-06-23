const request = require('request');

function parseBody(client, to) {
  return (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const contentType = response.headers['content-type'];
      if (contentType.split(';')[0] === 'application/json') {
        const json = JSON.parse(body);
        if (json.data.length !== 0) {
          const random = Math.floor(Math.random() * json.data.length);
          client.say(to, json.data[random].images.original.url);
        }
      }
    }
  };
}

module.exports = (client) => {
  client.addListener('message', (from, to, message) => {
    const matches = message.match(/^!giphy (\S.*)/i);
    if (matches !== null) {
      request(`http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=${matches[1].trim().replace(/ /g, '+')}`, parseBody(client, to));
    }
  });
};
