const Mean = Parse.Object.extend('Mean');
const Kind = Parse.Object.extend('Kind');
const isMuted = require('../utils/muteUtils');

module.exports = (client) => {
  client.on('message', async (message) => {
    if (message.author.bot || await isMuted(message.channel.id)) return;

    if (message.content.match(/^!(karma|score)$/i)) {
      message.channel.startTyping();
      try {
        const scores = {};

        const meanQuery = new Parse.Query(Mean);
        meanQuery.equalTo('channel', message.channel.id);
        const meanResult = await meanQuery.find();
        if (meanResult) {
          meanResult
            .map(result => result.get('user'))
            .forEach((curr) => {
              if (typeof scores[curr] === 'undefined') {
                scores[curr] = -1;
              } else {
                scores[curr] -= 1;
              }
            });
        }

        const kindQuery = new Parse.Query(Kind);
        kindQuery.equalTo('channel', message.channel.id);
        const kindResult = await kindQuery.find();
        if (kindResult) {
          kindResult
            .map(result => result.get('user'))
            .forEach((curr) => {
              if (typeof scores[curr] === 'undefined') {
                scores[curr] = 1;
              } else {
                scores[curr] += 1;
              }
            });
        }
        const list = [];
        const mapped = Object.keys(scores).map(key => ({ user: key, count: scores[key] }));

        const top = mapped.sort((a, b) => b.count - a.count);
        list.push('Karma toppliste!');
        for (let i = 0; i < Math.min(top.length, 3); i += 1) {
          list.push(`${i + 1}. ${client.users.get(top[i].user).username} har ${top[i].count} i karma.`);
        }
        list.push('');
        const bottom = mapped.sort((a, b) => a.count - b.count);
        list.push('Karma bunnliste!');
        for (let i = 0; i < Math.min(bottom.length, 3); i += 1) {
          list.push(`${i + 1}. ${client.users.get(bottom[i].user).username} har ${bottom[i].count} i karma.`);
        }

        message.channel.send(list.join('\n'));
      } catch (err) {
        console.log('karma', err);
      }
      message.channel.stopTyping();
    }

    if (message.content.match(/^!help/i)) {
      message.channel.send('!karma');
    }
  });
};
