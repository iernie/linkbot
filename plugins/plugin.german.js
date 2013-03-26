exports.init = function(client) {
	client.addListener('message', function(nick, to, text, message) {
		if (text.substring(0,20) == "!magischemiesmuschel") {
			client.say(to, nick + ": Frag doch später nochmal!");
		}
	});
};