module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(/^!8ball (\S.*(\||or|eller).+)/i);
    if (matches) {
      const queries = matches[1].split(/\||or|eller/i).filter(val => val !== '');
      const random = Math.floor(Math.random() * queries.length);
      message.reply(`svaret på spørsmålet ditt er: ${queries[random].trim()}`);
    }
  });
};
