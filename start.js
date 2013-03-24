var App = require('./bot.js');
var config = require('./config.js');
var Bot = App.Bot;
Bot = new Bot(config.config);
Bot.run();