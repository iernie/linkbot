const _ = require('lodash');

module.exports = (client, say) => {
  client.addListener('message', (from, to, message) => {
    const matches = message.match(/^!channel (\S.*)/i);
    if (matches !== null) {
      const users = _.filter(_.keys(client.chans[to].users), u => u.toLowerCase() !== from.toLowerCase() && u.toLowerCase() !== client.nick.toLowerCase()).join(', ');
      say(to, `${users}: ${matches[1]} (mvh ${from})`);
    }
  });
};
