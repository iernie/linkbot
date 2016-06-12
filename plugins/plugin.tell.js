module.exports = (client) => {
  const reminders = [];

  client.addListener('message', (from, to, message) => {
    if (message.match(/^!tell/)) {
      const matches = message.match(/^(\S+)\s(\S+)\s(.*)/);
      if (matches !== null) {
        const query = matches.splice(1);
        if (query !== null && query.length > 0 && query[1] !== null && query[1].trim() !== '' && query[2] !== null && query[2].trim() !== '') {
          reminders.push({
            from,
            to: query[1].trim(),
            message: query[2].trim()
          });
          client.say(to, `${from}, notert!`);
        }
      }
    }
  });

  client.addListener('join', (from, to) => {
    reminders.forEach((reminder, index, array) => {
      if (reminder.to.toLowerCase() === to.toLowerCase()) {
        client.say(from, `${reminder.to}: ${reminder.message} (${reminder.from})`);
        array.splice(index, 1);
      }
    });
  });
};
