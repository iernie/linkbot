const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

const bot = new Discord.Client({
  token: auth.token,
  autorun: true
});

bot.on('ready', () => {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(`${bot.username} - (${bot.id})`);
});

require(`./plugins/plugin.discord.title`)(bot); // eslint-disable-line
