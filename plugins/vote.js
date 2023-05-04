module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    if (message.content.match(/^!vote .+/i)) {
      try {
        message.react('👍');
        message.react('👎');
      } catch (err) {
        console.error('vote', err);
      }
    }

    if (message.content.match(/^!help/i)) {
      message.channel.send('!vote [question]');
    }
  });
};
