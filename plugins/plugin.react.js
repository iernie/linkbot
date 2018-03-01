module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    if (message.content.match(/test/i)) {
      message.react(':large_blue_circle:');
    }
  });
};
