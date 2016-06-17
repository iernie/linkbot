const _ = require('lodash');
const jsonfile = require('jsonfile');
const file = './reminders.json';

module.exports = (client) => {
  let reminders = [];
  jsonfile.readFile(file, (err, obj) => {
    if (!err) {
      reminders = obj;
    }
  });

  client.addListener('message', (from, to, message) => {
    if (message.match(/^!tell /)) {
      const matches = message.match(/^(\S+)\s(\S+)\s(.*)/);
      if (matches !== null) {
        const query = matches.splice(1);
        if (query !== null && query.length > 0 && query[1] !== null && query[1].trim() !== '' && query[2] !== null && query[2].trim() !== '') {
          const user = query[1].trim().toLowerCase();
          const users = _.map(_.keys(client.chans[to].users), u => u.toLowerCase());
          if (!_.isEmpty(_.filter(users, u => u === user))) {
            if (user === client.nick.toLowerCase()) {
              client.say(to, 'Tulling, jeg er jo her!');
            } else {
              client.say(to, `Tulling, ${query[1].trim()} er jo her!`);
            }
            return;
          }

          reminders.push({
            from,
            channel: to,
            to: query[1].trim(),
            message: query[2].trim()
          });
          jsonfile.writeFileSync(file, reminders);
          client.say(to, `${from}, notert!`);
        }
      }
    }
  });

  client.addListener('join', (from, to) => {
    reminders = reminders.filter((reminder) => {
      if (to.match(new RegExp(`${reminder.to}`, 'ig')) && reminder.channel === from) {
        client.say(from, `${to}: ${reminder.message} (${reminder.from})`);
        return false;
      }
      return true;
    });
    jsonfile.writeFileSync(file, reminders);
  });
};
