const { Game } = require('reversi');

const games = {};

module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(/^!(othello|reversi) (((\d),(\d))|new)/i);
    if (matches) {
      if (matches[2] === 'new') {
        games[message.channel.id] = new Game();
        message.channel.send(games[message.channel.id].toText());
      } else {
        games[message.channel.id].proceed(matches[4], matches[5]);
        message.channel.send(games[message.channel.id].toText());
      }
    }

    if (message.content.match(/^!help/i)) {
      message.channel.send('!othello [new | x,y]');
    }
  });
};
