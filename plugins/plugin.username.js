module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot || message.channel.type !== 'dm') return;

    const matches = message.content.match(/!username #?(\S+)\s(.+)/i);
    if (matches) {
      client.user.setUsername(matches[1]);
    }
  });
};
