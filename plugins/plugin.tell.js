const _ = require('lodash');
const jsonfile = require('jsonfile');
const file = './reminders.json';

module.exports = (client, say) => {
  let reminders = [];
  jsonfile.readFile(file, (err, obj) => {
    if (!err) {
      reminders = obj;
    }
  });

  client.addListener('message', (from, to, message) => {
    const matches = message.match(/^!tell ([a-z0-9æøå_]+)\s(.+)/i);
    if (matches !== null) {
      const user = matches[1].trim().toLowerCase();
      const users = _.map(_.keys(client.chans[to].users), u => u.toLowerCase());
      if (!_.isEmpty(_.filter(users, u => u === user))) {
        if (user === client.nick.toLowerCase()) {
          say(to, 'Tulling, jeg er jo her!');
          return;
        }
        say(to, `Tulling, ${matches[1].trim()} er jo her!`);
        return;
      }

      reminders.push({
        from,
        channel: to,
        to: matches[1].trim(),
        message: matches[2].trim()
      });
      jsonfile.writeFileSync(file, reminders);
      say(to, `${from}, notert!`);
    }
  });

  client.addListener('join', (from, to) => {
    reminders = _.filter(reminders, (reminder) => {
      if (to.match(new RegExp(`${reminder.to}`, 'i')) && reminder.channel === from) {
        return say(from, `${to}: ${reminder.message} (mvh ${reminder.from})`);
      }
      return true;
    });
    jsonfile.writeFileSync(file, reminders);
  });
};
