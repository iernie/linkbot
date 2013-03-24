var irc = require("irc");
var $ = require('jquery');

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

var config = {
	channels: ["#moskus"],
	server: "irc.quakenet.org",
	botName: "hembot"
};

var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels
});

/*
bot.addListener("join", function(channel, who) {
	bot.say(channel, "Velkommen tilbake, " + who + "!");
});
*/

bot.addListener("message", function(nick, to, text, message) {
	if (isURL(text)) {
		$.ajax({
      		url: text,
      		async: true,
      		complete: function(data) {
      			console.log(data.responseText);
      			if (data.responseText != undefined) {
      				var matches = data.responseText.match(/<title>(.*?)<\/title>/);
        			var title = matches[1];
        			bot.say(to, ">> " + title);
      			};
      		}
		});
	};
});