module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;
    if (message.content.match(new RegExp(`^(hei|hallo|(god ?)?morgen|halla) ${client.user.username}`, 'i'))) {
      message.reply('Eeeh, du vet at jeg er en bot ikke sant?');
    }
  });
};
