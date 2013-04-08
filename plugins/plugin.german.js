exports.init = function(client, from, to, message) {
	if (message.match(/^!magischemiesmuschel/)) {
		client.say(to, from + ": Frag doch später nochmal!");
	}
};