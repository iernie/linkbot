const distanceInWordsToNow = require('date-fns/distance_in_words_to_now');
const nb = require('date-fns/locale/nb');

const Mean = Parse.Object.extend('Mean');

module.exports = (client) => {
  client.on('message', async (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(/^!(mean|slem) <@!?(.+)> ?(\S.*)?/i);
    if (matches) {
      if (matches[3]) {
        try {
          const meanObject = new Mean();
          meanObject.set('user', matches[2].trim());
          meanObject.set('author', message.author.id);
          meanObject.set('channel', message.channel.id);
          meanObject.set('reason', matches[3].trim());
          meanObject.save();
          message.react('😈');
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          const query = new Parse.Query(Mean);
          query.equalTo('user', matches[2].trim());
          query.equalTo('channel', message.channel.id);
          query.descending('createdAt');
          const result = await query.first();
          if (result) {
            const days = distanceInWordsToNow(result.get('createdAt'), { includeSeconds: true, locale: nb });
            message.channel.send(`${client.users.get(result.get('user')).username} var sist slem for ${days} siden. Grunn: ${result.get('reason')}. Lagt til av ${client.users.get(result.get('author')).username}.`);
          } else {
            message.channel.send(`${client.users.get(matches[2].trim()).username} har vært snill :)`);
          }
        } catch (err) {
          console.log(err);
        }
      }
    }

    if (message.content.match(/^!help/i)) {
      message.channel.send('!mean @user [?reason=add]');
    }
  });
};
