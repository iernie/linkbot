module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    let user = message.content;
    const mention = message.content.match(/<@!?\d+>/i);
    if (mention) {
      const discordUser = client.users.get(mention[1]);
      if (discordUser) user = discordUser.username;
    }

    if (user.match(/aire|sjura/i)) {
      const emoji = client.emojis.find('name', 'aire');
      if (emoji) {
        message.react(emoji.id);
      }
    }

    if (user.match(/lasse?/i)) {
      const emoji = client.emojis.find('name', 'lass_ape');
      if (emoji) {
        message.react(emoji.id);
      }
    }

    if (user.match(/hemen/i)) {
      const emoji = client.emojis.find('name', 'hemen');
      if (emoji) {
        message.react(emoji.id);
      }
    }

    if (user.match(/redmist|kriss/i)) {
      const emoji = client.emojis.find('name', 'redmist');
      if (emoji) {
        message.react(emoji.id);
      }
    }

    if (user.match(/klausulen/i)) {
      const emoji = client.emojis.find('name', 'klausulen');
      if (emoji) {
        message.react(emoji.id);
      }
    }

    if (user.match(/ponas/i)) {
      const emoji = client.emojis.find('name', 'ponas');
      if (emoji) {
        message.react(emoji.id);
      }
    }

    if (user.match(/tobias(vl)?|spug/i)) {
      const emoji = client.emojis.find('name', 'tobias');
      if (emoji) {
        message.react(emoji.id);
      }
    }
  });
};
