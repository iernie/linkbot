var startStopDaemon = require('start-stop-daemon');
var Bot = require('./bot.js');
var config = require('./config.js');

startStopDaemon(function() {
	Bot.init(config.config);
});