exports.init = function(client) {
	client.addListener('message', function(nick, to, text, message) {
		if (text.substring(0,6) == "!8ball") {
			var options = text.substring(7).split(":");
			if (options.length > 1) {
				var random = Math.floor(Math.random() * options.length);
				client.say(to, nick + ", the answer to your question is: " + options[random]);
			} else {
				client.say(to, "Usage: !8ball first:second:third etc");
			}
		}
	});
}