module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(/^!8ball (\S.*(\|| or | eller ).+)\??$/i);
    if (matches) {
      const queries = matches[1].split(/\|| or | eller /i).filter(val => val.trim());
      const random = Math.floor(Math.random() * queries.length);
      message.reply(`svaret på spørsmålet ditt er: ${queries[random]}`);
    }

    if (message.content.match(/^!help/i)) {
      message.channel.send('!8ball [Q1] (eller, or, |) [Q2] [...Qx]');
    }
  });
};
