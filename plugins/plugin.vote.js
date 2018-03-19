module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    if (message.content.match(/^!vote .+/i)) {
      message.react('👍');
      message.react('👎');
    }

    if (message.content.match(/^!help/i)) {
      message.channel.send('!vote [question]');
    }
  });
};
