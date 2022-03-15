const formatDistanceToNow = require('date-fns/formatDistanceToNow');
const differenceInCalendarDays = require('date-fns/differenceInCalendarDays');
const firebase = require('firebase/compat/app');
const isMuted = require('../utils/muteUtils');

const db = firebase.firestore();

module.exports = (client) => {
  client.on('message', async (message) => {
    if (message.author.bot || await isMuted(message.channel.id)) return;

    const matches = message.content.match(/^!(mean|slem|bad) +<@!?(\d+)>( *\S.*)?/i);
    if (matches) {
      message.channel.startTyping();
      const hasNew = !!(matches[3] && matches[3].trim());

      const getLatest = async () => {
        db.collection('mean')
          .orderBy('createdAt', 'desc')
          .where('user', '==', matches[2].trim())
          .where('channel', '==', message.channel.id)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const result = querySnapshot.docs[0].data();
              const days = formatDistanceToNow(result.createdAt.toDate(), { includeSeconds: true });
              message.channel.send(`${client.users.cache.get(result.user).username} was last bad for ${days} ago; "${result.reason}" –${client.users.cache.get(result.author).username}.`);
            } else {
              message.channel.send(`${client.users.cache.get(matches[2].trim()).username} has been good :)`);
            }
          })
          .catch((error) => {
            console.log('Error getting documents: ', error);
          });
      };

      try {
        if (hasNew) {
          const newResult = await db.collection('mean')
            .orderBy('createdAt', 'desc')
            .where('author', '==', message.author.id)
            .where('channel', '==', message.channel.id)
            .get();

          if (newResult.size > 0 && differenceInCalendarDays(new Date(), newResult[0].data().createdAt.toDate()) < 1) {
            message.channel.send('You cannot use this more today.');
          } else {
            db.collection('mean').doc(`${message.channel.id}-${matches[2].trim()}`).set({
              user: matches[2].trim(),
              author: message.author.id,
              channel: message.channel.id,
              reason: matches[3].trim(),
              createdAt: new Date()
            })
              .then(() => {
                console.log('Document successfully written!');
              })
              .catch((error) => {
                console.error('Error writing document: ', error);
              });
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

    if (message.content.match(/^!(mean|slem|bad)$/i)) {
      message.channel.startTyping();
      try {
        db.collection('mean')
          .where('channel', '==', message.channel.id)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const toplist = querySnapshot.docs.map((doc) => doc.data().user)
                .reduce((acc, curr) => {
                  if (typeof acc[curr] === 'undefined') {
                    acc[curr] = 1;
                  } else {
                    acc[curr] += 1;
                  }
                  return acc;
                }, {});
              const list = [];
              const sorted = Object.keys(toplist).map((key) => ({ user: key, count: toplist[key] })).sort((a, b) => b.count - a.count);
              for (let i = 0; i < Math.min(sorted.length, 5); i += 1) {
                list.push(`${i + 1}. ${client.users.cache.get(sorted[i].user).username} has beed bad ${sorted[i].count} times.`);
              }
              message.channel.send(list.join('\n'));
            }
          })
          .catch((error) => {
            console.log('Error getting documents: ', error);
          });
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
