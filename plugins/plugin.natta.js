const moment = require('moment');

module.exports = (client, say) => {
  const users = new Map();
  client.addListener('message', (from, to, message) => {
    if (message.match(new RegExp(`^.{0,5}((go+d ?)?nat+a?)(!|${client.nick}|alle|sammen|,| )*$`, 'i'))) {
      const user = users.get(from.toLowerCase());
      if (user === undefined || moment().diff(user.time, 'minutes') >= 5) {
        say(to, `natta ${from}!`);
        users.set(from.toLowerCase(), { time: moment() });
      }
    }
  });
};
