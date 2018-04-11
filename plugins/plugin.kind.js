const distanceInWordsToNow = require('date-fns/distance_in_words_to_now');
const nb = require('date-fns/locale/nb');

const Kind = Parse.Object.extend('Kind');

module.exports = (client) => {
  client.on('message', async (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(/^!(kind|snill) <@!?(\d+)> ?(\S.*)?/i);
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
          message.channel.send(`${client.users.get(result.get('user')).username} var sist snill for ${days}; "${result.get('reason')}" –${client.users.get(result.get('author')).username}.`);
        } else if (!hasNew) {
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

    if (message.content.match(/^!(kind|snill)$/i)) {
      try {
        const query = new Parse.Query(Kind);
        query.equalTo('channel', message.channel.id);
        const results = await query.find();
        if (results) {
          const toplist = results
            .map(result => result.get('user'))
            .reduce((acc, curr) => {
              if (typeof acc[curr] === 'undefined') {
                acc[curr] = 1;
              } else {
                acc[curr] += 1;
              }
              return acc;
            }, {});
          const sorted = Object.keys(toplist).map(key => ({ user: key, count: toplist[key] })).sort((a, b) => b.count - a.count);
          message.channel.send('Snill toppliste!');
          for (let i = 0; i < Math.min(sorted.length, 5); i += 1) {
            message.channel.send(`${i + 1}. ${client.users.get(sorted[i].user).username} har vært snill ${sorted[i].count} ganger.`);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (message.content.match(/^!help/i)) {
      message.channel.send('!kind @user [?reason=add]');
    }
  });
};
