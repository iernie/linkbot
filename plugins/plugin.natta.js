module.exports = (client) => {
  client.addListener('message', (from, to, message) => {
    if (message.match(new RegExp(`^((go+d ?)?nat+a?)(!|${client.nick}|alle|sammen|,| )*$`, 'i'))) {
      client.say(to, `natta ${from}!`);
    }
  });
};
