const distanceInWordsToNow = require('date-fns/distance_in_words_to_now');
const differenceInCalendarDays = require('date-fns/difference_in_calendar_days');
const nb = require('date-fns/locale/nb');

const Mean = Parse.Object.extend('Mean');

module.exports = (client) => {
  client.on('message', async (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(/^!(mean|slem) +<@!?(\d+)>( *\S.*)?/i);
    if (matches) {
      message.channel.startTyping();
      const hasNew = !!matches[3].trim();

      const getLatest = async () => {
        const query = new Parse.Query(Mean);
        query.equalTo('user', matches[2].trim());
        query.equalTo('channel', message.channel.id);
        query.descending('createdAt');
        const result = await query.first();
        if (result) {
          const days = distanceInWordsToNow(result.get('createdAt'), { includeSeconds: true, locale: nb });
          message.channel.send(`${client.users.get(result.get('user')).username} var sist slem for ${days} siden; "${result.get('reason')}" –${client.users.get(result.get('author')).username}.`);
        } else if (!hasNew) {
          message.channel.send(`${client.users.get(matches[2].trim()).username} har vært snill :)`);
        }
      };

      try {
        if (hasNew) {
          const newQuery = new Parse.Query(Mean);
          newQuery.equalTo('author', message.author.id);
          newQuery.equalTo('channel', message.channel.id);
          newQuery.descending('createdAt');
          const newResult = await newQuery.first();
          if (newResult && differenceInCalendarDays(new Date(), newResult.get('createdAt')) < 1) {
            message.channel.send('Du har brukt opp dagskvoten din med !slem');
          } else {
            const meanObject = new Mean();
            meanObject.set('user', matches[2].trim());
            meanObject.set('author', message.author.id);
            meanObject.set('channel', message.channel.id);
            meanObject.set('reason', matches[3].trim());

            await getLatest();

            meanObject.save();
            message.react('😈');
          }
        } else {
          await getLatest();
        }
      } catch (err) {
        console.log('mean', err);
      }
      message.channel.stopTyping();
    }

    if (message.content.match(/^!(mean|slem)$/i)) {
      message.channel.startTyping();
      try {
        const query = new Parse.Query(Mean);
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
          for (let i = 0; i < Math.min(sorted.length, 5); i += 1) {
            message.channel.send(`${i + 1}. ${client.users.get(sorted[i].user).username} har vært slem ${sorted[i].count} ganger.`);
          }
        }
      } catch (err) {
        console.log('mean', err);
      }
      message.channel.stopTyping();
    }

    if (message.content.match(/^!help/i)) {
      message.channel.send('!mean @user [?reason=add]');
    }
  });
};
