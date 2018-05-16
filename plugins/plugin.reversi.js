const { Game } = require('reversi');

let games = [];

const removeGame = (channelId) => {
  const index = games.findIndex(g => g[0] === channelId);
  if (index !== -1) {
    games = games.splice(index, 1);
  }
};

const addGame = (channnelId) => {
  removeGame(channnelId);
  const game = new Game();
  games.push([channnelId, game]);
  return game;
};

module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(/^!(othello|reversi) (((\d),(\d))|new)/i);
    if (matches) {
      if (matches[2] === 'new') {
        const game = addGame(message.channel.id);
        message.channel.send(game.toText());
      } else if (matches[3]) {
        const index = games.findIndex(g => g[0] === message.channel.id);
        if (index !== -1) {
          const game = games[index][1];
          game.proceed(matches[4], matches[5]);
          message.channel.send(game.toText());
          if (game.isEnded) {
            removeGame(message.channel.id);
            message.channel.send('Game over!');
          }
        }
      }
    }

    if (message.content.match(/^!help/i)) {
      message.channel.send('!othello [new | x,y]');
    }
  });
};
