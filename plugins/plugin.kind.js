const distanceInWordsToNow = require('date-fns/distance_in_words_to_now');
const nb = require('date-fns/locale/nb');

const Kind = Parse.Object.extend('Kind');

module.exports = (client) => {
  client.on('message', async (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(/^!(kind|snill) <@!?(.+)> ?(\S.*)?/i);
    if (matches) {
      const hasNew = !!matches[3];

      try {
        const query = new Parse.Query(Kind);
        query.equalTo('user', matches[2].trim());
        query.equalTo('channel', message.channel.id);
        query.descending('createdAt');
        const result = await query.first();
        if (result) {
          const days = distanceInWordsToNow(result.get('createdAt'), { includeSeconds: true, locale: nb });
          message.channel.send(`${client.users.get(result.get('user')).username} var sist snill for ${days} siden. Grunn: ${result.get('reason')}. Lagt til av ${client.users.get(result.get('author')).username}.`);
        } else if (!hasNew) {
          console.log(hasNew, matches[2]);
          message.channel.send(`${client.users.get(matches[2].trim()).username} har ikke vært snill :(`);
        }
      } catch (err) {
        console.log(err);
      }

      if (hasNew) {
        try {
          const kindObject = new Kind();
          kindObject.set('user', matches[2].trim());
          kindObject.set('author', message.author.id);
          kindObject.set('channel', message.channel.id);
          kindObject.set('reason', matches[3].trim());
          kindObject.save();
          message.react('👼');
        } catch (err) {
          console.log(err);
        }
      }
    }

    if (message.content.match(/^!help/i)) {
      message.channel.send('!kind @user [?reason=add]');
    }
  });
};
