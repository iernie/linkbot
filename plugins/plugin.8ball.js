module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(/^!8ball (\S.*(\|| or | eller ).+)/i);
    if (matches) {
      message.channel.startTyping();
      const queries = matches[1].split(/\|| or | eller /i).map(val => val.replace(/\?$/, '').trim());
      const random = Math.floor(Math.random() * queries.length);
      message.channel.send(queries[random]);
      message.channel.stopTyping();
    }

    if (message.content.match(/^!help/i)) {
      message.channel.send('!8ball [Q1] (eller, or, |) [Q2] [...Qx]');
    }
  });
};
