module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    if (message.content.match(/aire|sjura/i)) {
      const emoji = client.emojis.find('name', 'aire');
      if (emoji) {
        message.react(emoji.id);
      }
    }

    if (message.content.match(/lasse?/i)) {
      const emoji = client.emojis.find('name', 'lass_ape');
      if (emoji) {
        message.react(emoji.id);
      }
    }

    if (message.content.match(/hemen/i)) {
      const emoji = client.emojis.find('name', 'hemen');
      if (emoji) {
        message.react(emoji.id);
      }
    }

    if (message.content.match(/redmist/i)) {
      const emoji = client.emojis.find('name', 'redmist');
      if (emoji) {
        message.react(emoji.id);
      }
    }

    if (message.content.match(/klausulen/i)) {
      const emoji = client.emojis.find('name', 'klausulen');
      if (emoji) {
        message.react(emoji.id);
      }
    }

    if (message.content.match(/ponas/i)) {
      const emoji = client.emojis.find('name', 'ponas');
      if (emoji) {
        message.react(emoji.id);
      }
    }
  });
};
