module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot || message.channel.type !== 'dm') return;

    const matches = message.content.match(/!say #(\S+)\s(.+)/i);
    if (matches) {
      const channel = client.channels.find('name', matches[1]);
      channel.say(matches[2]);
    }
  });
};
