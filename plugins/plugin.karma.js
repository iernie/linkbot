const admin = require('firebase-admin');

const db = admin.database();
const isMuted = require('../utils/muteUtils');

module.exports = (client) => {
  client.on('message', async (message) => {
    if (message.author.bot || await isMuted(message.channel.id)) return;

    if (message.content.match(/^!(karma|score)$/i)) {
      message.channel.startTyping();
      try {
        const scores = {};

        db.collection('mean').where('channel', '==', message.channel.id)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const { user } = doc.data();
              if (typeof scores[user] === 'undefined') {
                scores[user] = -1;
              } else {
                scores[user] -= 1;
              }
            });
          })
          .catch((error) => {
            console.log('Error getting documents: ', error);
          });

        db.collection('kind').where('channel', '==', message.channel.id)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const { user } = doc.data();
              if (typeof scores[user] === 'undefined') {
                scores[user] = 1;
              } else {
                scores[user] += 1;
              }
            });
          })
          .catch((error) => {
            console.log('Error getting documents: ', error);
          });

        const list = [];
        const mapped = Object.keys(scores).map((key) => ({ user: key, count: scores[key] }));

        const top = mapped.sort((a, b) => b.count - a.count);
        list.push('Karma toppliste!');
        for (let i = 0; i < Math.min(top.length, 3); i += 1) {
          list.push(`${i + 1}. ${client.users.cache.get(top[i].user).username} har ${top[i].count} i karma.`);
        }
        list.push('');
        const bottom = mapped.sort((a, b) => a.count - b.count);
        list.push('Karma bunnliste!');
        for (let i = 0; i < Math.min(bottom.length, 3); i += 1) {
          list.push(`${i + 1}. ${client.users.cache.get(bottom[i].user).username} har ${bottom[i].count} i karma.`);
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
