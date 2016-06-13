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
    if (message.match(/^!g /)) {
      const matches = message.match(/^(\S+)\s(.*)/);
      if (matches !== null) {
        const query = matches.splice(1);
        if (query !== null && query.length > 0 && query[1] !== null && query[1].trim() !== '') {
          request(`https://www.googleapis.com/customsearch/v1?key=${plugin.options.key}&cx=${plugin.options.cx}&q=${query[1].trim()}`, parseBodyFunction(client, to));
        }
      }
    }
  });
};
