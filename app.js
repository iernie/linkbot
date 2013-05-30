var Bot = require('./bot.js');
var Config = require('./config.js');

if (undefined == process.argv[2]) {
	console.log("Pleas specify a server!");
	process.exit(1);
} else {
	for (server in Config.servers) {
		if (server == process.argv[2]) {
			console.log("this is it!");
			Bot.init(Config.servers[server]);
		}	
	}
}

