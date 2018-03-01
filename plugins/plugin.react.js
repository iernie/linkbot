module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    if (message.content.match(/test/i)) {
      const emoji = client.emojis.find('name', 'large_blue_circle');
      message.react(emoji.id);
    }
  });
};
