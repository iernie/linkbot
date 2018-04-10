const distanceInWordsToNow = require('date-fns/distance_in_words_to_now');
const differenceInDays = require('date-fns/difference_in_days');
const nb = require('date-fns/locale/nb');

const Mean = Parse.Object.extend('Mean');

module.exports = (client) => {
  client.on('message', async (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(/^!(mean|slem) <@!?(\d+)> ?(\S.*)?/i);
    if (matches) {
      const hasNew = !!matches[3];

      try {
        const query = new Parse.Query(Mean);
        query.equalTo('user', matches[2].trim());
        query.equalTo('channel', message.channel.id);
        query.descending('createdAt');
        const result = await query.first();
        if (result) {
          const days = distanceInWordsToNow(result.get('createdAt'), { includeSeconds: true, locale: nb });
          message.channel.send(`${client.users.get(result.get('user')).username} var sist slem for ${days} siden. Grunn: ${result.get('reason')}. Lagt til av ${client.users.get(result.get('author')).username}.`);
        } else if (!hasNew) {
          message.channel.send(`${client.users.get(matches[2].trim()).username} har vært snill :)`);
        }
      } catch (err) {
        console.log(err);
      }

      if (hasNew) {
        const query = new Parse.Query(Mean);
        query.equalTo('author', message.author.id);
        query.equalTo('channel', message.channel.id);
        query.descending('createdAt');
        const result = await query.first();
        if (result && differenceInDays(new Date(), result.get('createdAt')) < 1) {
          message.channel.send('Du har brukt opp dagskvoten din med !slem');
        } else {
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
        }
      }
    }

    if (message.content.match(/^!(mean|slem)$/i)) {
      try {
        const query = new Parse.Query(Mean);
        query.equalTo('channel', message.channel.id);
        query.limit(1000);
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
          message.channel.send('Slem toppliste!');
          for (let i = 0; i < Math.min(sorted.length, 5); i += 1) {
            message.channel.send(`${i + 1}: ${client.users.get(sorted[i].user).username} har vært slem ${sorted[i].count} ganger.`);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (message.content.match(/^!help/i)) {
      message.channel.send('!mean @user [?reason=add]');
    }
  });
};
