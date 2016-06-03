exports.init = function(client, from, to, message) {
	if (message.match(/^(natta|god natt|godnatt|god natta)(!|linkbot|,| |alle|sammen)*$/i)) {
		client.say(to, "natta " + from + "!");
	}
};
