global.Parse = require('parse/node');
const Discord = require('discord.js');

const plugins = require('./plugins');

const client = new Discord.Client();
Parse.initialize(process.env.parse_app_id);
Parse.serverURL = process.env.parse_server_url;

client.on('ready', () => {
  client.user.setPresence({
    game: {
      name: 'Livets harde skole',
      type: 0
    }
  });
  console.log('Bip bop, I am ready!');
});

plugins.forEach(plugin => plugin(client));

client.login(process.env.token);
