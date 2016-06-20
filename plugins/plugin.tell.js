const jsonfile = require('jsonfile');
const file = './reminders.json';

module.exports = (client) => {
  let shouldSave = false;
  let reminders = [];
  jsonfile.readFile(file, (err, obj) => {
    if (!err) {
      reminders = obj;
    }
  });

  function checkMessages(channel, to) {
    reminders = reminders.filter((reminder) => {
      if (to.match(new RegExp(`${reminder.to}`, 'ig')) && reminder.channel === channel) {
        client.say(channel, `${to}: ${reminder.message} (mvh ${reminder.from})`);
        shouldSave = true;
        return false;
      }
      return true;
    });
    if (shouldSave) {
      shouldSave = false;
      jsonfile.writeFileSync(file, reminders);
    }
  }

  client.addListener('message', (from, to, message) => {
    const matches = message.match(/^!tell ([a-z0-9æøå_]+)\s(.+)/i);
    if (matches !== null) {
      if (matches[1].trim().toLowerCase() === client.nick.toLowerCase()) {
        client.say(to, 'Tulling, jeg er jo her!');
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
