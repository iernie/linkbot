module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    if (message.content.match(/^!vote (\S.*)/i)) {
      message.react('👍');
      message.react('👎');
    }
  });
};