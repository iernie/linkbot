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

  function checkMessages(channel, to) {
    let shouldSave = false;
    reminders = _.filter(reminders, reminder => {
      if (to.match(new RegExp(`${reminder.to}`, 'i')) && reminder.channel === channel) {
        client.say(channel, `${to}: ${reminder.message} (mvh ${reminder.from})`);
        shouldSave = true;
        return false;
      }
      return true;
    });
    if (shouldSave) {
      jsonfile.writeFileSync(file, reminders);
    }
  }

  client.addListener('message', (from, to, message) => {
    const matches = message.match(/^!tell ([a-z0-9æøå_]+)\s(.+)/i);
    if (matches !== null) {
      const user = matches[1].trim().toLowerCase();
      const users = _.map(_.keys(client.chans[to].users), u => u.toLowerCase());
      if (!_.isEmpty(_.filter(users, u => u === user))) {
        if (user === client.nick.toLowerCase()) {
          client.say(to, 'Tulling, jeg er jo her!');
          return;
        }
        client.say(to, `Tulling, ${matches[1].trim()} er jo her!`);
        return;
      }

      reminders.push({
        from,
        channel: to,
        to: matches[1].trim(),
        message: matches[2].trim()
      });
      jsonfile.writeFileSync(file, reminders);
      client.say(to, `${from}, notert!`);
    } else {
      checkMessages(to, from);
    }
  });

  client.addListener('join', (from, to) => {
    checkMessages(from, to);
  });
};
