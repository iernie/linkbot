module.exports = (client) => {
  client.addListener('message', (from, to, message) => {
    if (message.match(new RegExp(`^((god ?)?natta?)(!|${client.nick}|alle|sammen|,| )*$`, 'ig'))) {
      client.say(to, `natta ${from}!`);
    }
  });
};
