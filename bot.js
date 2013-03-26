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

    client.addListener('message', function(from, to, message){
        if (to.match(/^[#&]/)) {
            var plugins = config.plugins;
            for (var i = plugins.length - 1; i >= 0; i--) {
                Plugins.init(plugins[i], client, from, to, message);
            }
        }
    });

    client.addListener('error', function(message) {
        console.log('error: ', message);
    });
};