const distanceInWordsToNow = require('date-fns/distance_in_words_to_now');
const nb = require('date-fns/locale/nb');

const Mean = Parse.Object.extend('Mean');

module.exports = (client) => {
  client.on('message', async (message) => {
    if (message.author.bot) return;

    const matchesNew = message.content.match(/^!mean add <@(.+)> ?(\S.*)?/i);
    if (matchesNew) {
      try {
        const meanObject = new Mean();
        meanObject.set('user', matchesNew[1].trim());
        meanObject.set('author', message.author.id);
        meanObject.set('channel', message.channel.id);
        if (matchesNew[2]) {
          meanObject.set('reason', matchesNew[2].trim());
        }
        meanObject.save();
        message.reply('done!');
      } catch (err) {
        console.log(err);
      }
    }

    const matchesLast = message.content.match(/^!mean <@(.+)>/i);
    if (matchesLast) {
      try {
        const query = new Parse.Query(Mean);
        query.equalTo('user', matchesLast[1].trim());
        query.descending('createdAt');
        const result = await query.first();
        if (result) {
          const days = distanceInWordsToNow(result.get('createdAt'), { includeSeconds: true, locale: nb });
          let reason;
          if (result.get('reason')) {
            reason = `Grunn: ${result.get('reason')}. `;
          }
          message.channel.send(`<@${result.get('user')}> var sist slem for ${days} siden. ${reason}Lagt til av <@${result.get('author')}>.`);
        } else {
          message.channel.send(`<@${matchesLast[1].trim()}> har vært snill :)`);
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
};
