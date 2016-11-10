const irc = require('irc');
const jsonfile = require('jsonfile');
const config = require('./config');
const mute = './mute.json';

const client = new irc.Client(config.server, config.nick, config.options);
client.setMaxListeners(config.plugins.length * 2);

const say = function(target, text) {
  const isMuted = jsonfile.readFileSync(mute);
  if (!isMuted) {
    client.say(target, text);
  }
  return isMuted;
};

config.plugins.forEach((plugin) => {
  require(`./plugins/plugin.${plugin.name}`)(client, say, plugin);
});

client.addListener('error', (message) => {
  console.error('ERROR: %s: %s', message.command, message.args.join(' '));
});
