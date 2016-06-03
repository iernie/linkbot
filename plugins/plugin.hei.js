exports.init = function(client, from, to, message) {
	if (message.match(/^linkbot.*$/i)) {
		client.say(to, "hei på deg " + from + " :)");
	}
};
