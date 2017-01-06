module.exports = (client, say) => {
  client.addListener('message', (from, to, message) => {
    if (message.match(new RegExp(`^(hei|hallo|(god ?)?morgen|halla) ${client.nick}$`, 'i'))) {
      say(to, `Eeeh, du vet at jeg er en bot ikke sant?`);
    }
  });
};
