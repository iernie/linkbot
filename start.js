global.Parse = require('parse/node');
const Discord = require('discord.js');

const plugins = require('./plugins');

const client = new Discord.Client();
Parse.initialize(process.env.parse_app_id, null, process.env.parse_master_key);
Parse.serverURL = process.env.parse_server_url;

client.on('ready', () => {
  console.log('Bip bop, I am ready!');
});

client.on('error', (error) => {
  console.log(error);
});

client.on('debug', (info) => {
  console.log(info);
});

plugins.forEach(plugin => plugin(client));

client.login(process.env.token);
