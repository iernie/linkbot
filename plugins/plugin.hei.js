module.exports = (client) => {
  client.addListener('message', (from, to, message) => {
    if (message.match(new RegExp(`^((hei|hallo|heisann)* )${client.nick}`, 'ig'))) {
      client.say(to, `hei på deg ${from} :)`);
    }
  });
};
