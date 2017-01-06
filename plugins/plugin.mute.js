const jsonfile = require('jsonfile');

const file = './mute.json';

module.exports = (client) => {
  let isMuted = jsonfile.readFileSync(file);

  client.addListener('pm', (from, message) => {
    const matches = message.match(/^!mute$/i);
    if (matches !== null) {
      isMuted = !isMuted;
      jsonfile.writeFileSync(file, isMuted);
      client.say(from, `Mute er satt til ${isMuted}.`);
    }
  });
};
