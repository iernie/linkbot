const formatDistanceToNow = require('date-fns/formatDistanceToNow');
const nb = require('date-fns/locale/nb');

module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    const match = message.content.match(new RegExp('^.{0,5}((godt ?nytt ?år)|(happy ?new ?year))(!+)?$', 'i'));
    if (match && match[0] !== '') {
      if (new Date().getMonth() === 0) {
        message.channel.send(`Godt nytt år <@${message.author.id}>!`);
      } else {
        message.channel.send(`Du er for tidlig! Det er ${formatDistanceToNow(new Date(new Date().getFullYear() + 1, 0, 1, 0, 0, 0, 0), { includeSeconds: true, locale: nb })} igjen.`);
      }
    }
  });
};
