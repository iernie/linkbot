var Irc = require('irc');

exports.init = function(config) {
    var client = new Irc.Client(config.irc.server, config.bot.nick, {
        autoConnect: true,
        autoRejoin: true,
        userName: config.bot.nick,
        realName: config.bot.name,
        port: config.irc.port,
        channels: config.irc.channels
    });

    var plugins = config.plugins;
    client.addListener('message', function(from, to, message) {
        if (to.match(/^[#&]/)) {
            for (plugin in plugins) {
                var p = require("./plugins/plugin." + plugin + ".js");
                p.init(client, from, to, message);
            }
        }
    });

    client.addListener('error', function(message) {
        console.log('error', message);
    });
};
