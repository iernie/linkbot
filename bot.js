var irc = require("irc");
var $ = require('jquery');

var client = irc.Client;

var Bot = function(config) {
	client = new irc.Client(config.irc.server, config.bot.nick, {
		autoConnect: true,
		userName: config.bot.nick,
		realName: config.bot.name,
		port: config.irc.port,
		channels: config.irc.channels
	});

	client.addListener('message', function(nick, to, text, message) {
		var texts = text.split(" ");
		for (var i = texts.length - 1; i >= 0; i--) {
			if(isURL(texts[i])) {
				var url = texts[i];
				if (!url.match(/^[a-zA-Z]+:\/\//)) {
				    url = 'http://' + url;
				}
				$.ajax({
		      		url: url,
		      		complete: function(data) {
		      			if (data.responseText != undefined) {
		      				var matches = data.responseText.match(/<title>(.*?)<\/title>/);
		        			var title = matches[1];
		        			client.say(to, ">> " + title);
		      			};
		      		}
				});
			}
		};
	});

	client.addListener('error', function(message) {
	    console.log('error: ', message);
	});
}

Bot.prototype = {
	run: function() {
		client.connect();
	}
}

function isURL(str) {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
	'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
	'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
	'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
	'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
	'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	if(!pattern.test(str)) {
		return false;
	} else {
		return true;
	}
}

exports.Bot = Bot;