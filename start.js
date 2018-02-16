const irc = require('irc');
const config = require('./config');

const client = new irc.Client(config.server, config.nick, config.options);
client.setMaxListeners(config.plugins.length * 2);

const say = function say(target, text) {
  client.say(target, text);
};

config.plugins.forEach((plugin) => {
  require(`./plugins/plugin.${plugin.name}`)(client, say, plugin); // eslint-disable-line
});

client.addListener('error', (message) => {
  console.error('ERROR: %s: %s', message.command, message.args.join(' '));
});
