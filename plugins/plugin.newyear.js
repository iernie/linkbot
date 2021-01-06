const differenceInCalendarDays = require('date-fns/differenceInCalendarDays');

module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    if (message.content.match(new RegExp('^(((go+dt ?)?nytt *år)|(happy *new *year))*(!*)?$', 'i'))) {
      const days = differenceInCalendarDays(new Date(new Date().getFullYear(), 12, 31), new Date());
      if (days === 0 || days === 1 || days === 364) {
        message.channel.send(`Godt nytt år <@${message.author.id}>!`);
      } else {
        message.channel.send(`Du er ${days} dager for tidlig!`);
      }
    }
  });
};
