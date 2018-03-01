module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    if (message.content.match(/test/i)) {
      console.log(client.emojis.map(e => e.toString()).join(' '));
      const emoji = client.emojis.find('name', 'large_blue_circle');
      if (emoji) {
        message.react(emoji.id);
      }
    }
  });
};
