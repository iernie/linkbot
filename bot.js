var Irc = require('irc');
var Plugins = require('./plugins.js');

exports.init = function(config) {
    var client = new Irc.Client(config.irc.server, config.bot.nick, {
        autoConnect: true,
        userName: config.bot.nick,
        realName: config.bot.name,
        port: config.irc.port,
        channels: config.irc.channels
    });

    Plugins.init(client);

    client.addListener('error', function(message) {
        console.log('error: ', message);
    });
};