const differenceInCalendarDays = require('date-fns/differenceInCalendarDays');

module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    const match = message.content.match(new RegExp('^((godt ?nytt ?år)|(happy ?new ?year))(!+)?$', 'i'));
    if (match && match[0] !== '') {
      const days = differenceInCalendarDays(new Date(new Date().getFullYear(), 11, 31), new Date());
      if (days === 0 || days === 1 || days === 364) {
        message.channel.send(`Godt nytt år <@${message.author.id}>!`);
      } else {
        message.channel.send(`Du er ${days} dager for tidlig!`);
      }
    }
  });
};
