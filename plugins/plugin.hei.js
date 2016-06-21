module.exports = (client) => {
  client.addListener('message', (from, to, message) => {
    if (message.match(new RegExp(`^${client.nick}`, 'i'))) {
      client.say(to, `hei på deg ${from} :)`);
    }
  });
};
