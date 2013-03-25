var startStopDaemon = require('start-stop-daemon');
var App = require('./bot.js');
var config = require('./config.js');

startStopDaemon(function() {
	var Bot = App.Bot;
	Bot = new Bot(config.config);
	Bot.run();
});