const Discord = require('discord.js');
const Parse = require('parse/node');

const client = new Discord.Client();
Parse.initialize(process.env.parse_app_id);
Parse.serverURL = process.env.parse_server_url;

require(`./plugins/plugin.hei`)(client); // eslint-disable-line
require(`./plugins/plugin.old`)(client); // eslint-disable-line

client.login(process.env.token);
