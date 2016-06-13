function filterAndCleanInput(str) {
  const matches = str.match(/^(\S+)\s(.*)/);
  if (matches !== null) {
    const q = matches.splice(1);
    if (q !== null && q.length > 0 && q[1] !== null && q[1].trim() !== '') {
      return q[1].split(':').filter((val) => val !== '');
    }
  }
  return null;
}

module.exports = (client) => {
  client.addListener('message', (from, to, message) => {
    if (message.match(/^!8ball /)) {
      const matches = filterAndCleanInput(message);
      if (matches !== null && matches.length > 1) {
        const random = Math.floor(Math.random() * matches.length);
        client.say(to, `${from}, svaret på spørsmålet ditt er: ${matches[random]}`);
      }
    }
  });
};
