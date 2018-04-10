const Mean = Parse.Object.extend('Mean');
const Kind = Parse.Object.extend('Kind');

module.exports = (client) => {
  client.on('message', async (message) => {
    if (message.author.bot) return;

    if (message.content.match(/^!(karma|score)$/i)) {
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

        const mapped = Object.keys(scores).map(key => ({ user: key, count: scores[key] }));

        const top = mapped.sort((a, b) => b.count - a.count);
        message.channel.send('Karma toppliste!');
        for (let i = 0; i < Math.min(top.length, 3); i += 1) {
          message.channel.send(`${i + 1}. ${client.users.get(top[i].user).username} har ${top[i].count} i karma.`);
        }

        const bottom = mapped.sort((a, b) => a.count - b.count);
        message.channel.send('Karma bunnliste!');
        for (let i = 0; i < Math.min(bottom.length, 3); i += 1) {
          message.channel.send(`${i + 1}. ${client.users.get(bottom[i].user).username} har ${bottom[i].count} i karma.`);
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (message.content.match(/^!help/i)) {
      message.channel.send('!karma');
    }
  });
};
