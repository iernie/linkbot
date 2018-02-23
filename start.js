const Discord = require('discord.js');
const Parse = require('parse/node');

const client = new Discord.Client();
Parse.initialize(process.env.parse_app_id);
Parse.serverURL = process.env.parse_server_url;


client.login(process.env.token);

// require(`./plugins/plugin.discord.title`)(bot); // eslint-disable-line
