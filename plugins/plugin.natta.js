module.exports = (client) => {
  client.addListener('message', (from, to, message) => {
    if (message.match(new RegExp(`^(natta|god|natt|,| )+(!|${client.nick}|alle|sammen|,| )*`, 'ig'))) {
      client.say(to, `natta ${from}!`);
    }
  });
};
