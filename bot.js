var Irc = require('irc');
var mongojs = require('mongojs');

exports.init = function(config) {
    var client = new Irc.Client(config.irc.server, config.bot.nick, {
        autoConnect: true,
        userName: config.bot.nick,
        realName: config.bot.name,
        port: config.irc.port,
        channels: config.irc.channels
    });

    var db = mongojs(config.database);

    client.addListener('message', function(from, to, message){
        if (to.match(/^[#&]/)) {
            var plugins = config.plugins;
            for (plugin in plugins) {
                var p = require('./plugins/plugin.' + plugin + ".js");
                p.init(client, from, to, message, db, plugins[plugin]);
            }
        }
    });

    client.addListener('error', function(message) {
        console.log('error: ', message);
    });
};