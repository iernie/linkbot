var startStopDaemon = require('start-stop-daemon');
var Bot = require('./bot.js');
var Config = require('./config.js');

startStopDaemon(function() {
	for (var i = Config.servers.length - 1; i >= 0; i--) {
		Bot.init(Config.servers[i]);
	};
});