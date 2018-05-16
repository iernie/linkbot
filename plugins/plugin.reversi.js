const { Game } = require('reversi');

let game = null;

module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(/^!(othello|reversi) (((\d),(\d))|new)/i);
    if (matches) {
      if (matches[2] === 'new') {
        game = new Game();
        message.channel.send(game.toText());
      } else if (matches[3]) {
        if (game) {
          game.proceed(matches[4], matches[5]);
          message.channel.send(game.toText());
          if (game.isEnded) {
            game = null;
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
