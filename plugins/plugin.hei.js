module.exports = (client) => {
  client.addListener('message', (from, to, message) => {
    if (message.match(new RegExp(`^((god )?(hei|hallo|heisann|morn|morgen|kveld)+)( ${client.nick})?$`, 'i'))) {
      client.say(to, `hei på deg ${from} :)`);
    }
  });
};
