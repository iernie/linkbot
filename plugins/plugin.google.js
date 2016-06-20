const request = require('request');

function parseBodyFunction(client, to) {
  return (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const contentType = response.headers['content-type'];
      if (contentType.split(';')[0] === 'application/json') {
        const json = JSON.parse(body);
        if (json.items !== null && json.items.length > 0) {
          client.say(to, `>> ${json.items[0].title} ${json.items[0].link}`);
        }
      }
    }
  };
}

module.exports = (client, plugin) => {
  client.addListener('message', (from, to, message) => {
    const matches = message.match(/^!g (\S.*)/);
    if (matches !== null) {
      request(`https://www.googleapis.com/customsearch/v1?key=${plugin.options.key}&cx=${plugin.options.cx}&q=${matches[1].trim()}`, parseBodyFunction(client, to));
    }
  });
};
