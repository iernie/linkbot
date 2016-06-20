module.exports = (client) => {
  client.addListener('message', (from, to, message) => {
    const matches = message.match(/^!8ball (\S.*:.+)/i);
    if (matches !== null) {
      const queries = matches[1].split(':').filter(val => val !== '');
      const random = Math.floor(Math.random() * queries.length);
      client.say(to, `${from}, svaret på spørsmålet ditt er: ${queries[random]}`);
    }
  });
};
