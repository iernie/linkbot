module.exports = (client) => {
  client.addListener('message', (from, to, message) => {
    if (message.match(new RegExp(`^((god ?)?natt+a?)(!|${client.nick}|alle|sammen|,| )*$`, 'i'))) {
      client.say(to, `natta ${from}!`);
    }
  });
};
