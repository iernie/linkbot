module.exports = (client) => {
  client.addListener('pm', (from, message) => {
    const matches = message.match(/!say (#\S+)\s(.+)/i);
    if (matches !== null) {
      client.say(matches[1], matches[2]);
    }
  });
};
