var request = require('request');

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

exports.init = function(client) {
	client.addListener('message', function(nick, to, text, message) {
		var texts = text.split(" ");
		for (var i = texts.length - 1; i >= 0; i--) {
			if(isURL(texts[i])) {
				var url = texts[i];
				if (!url.match(/^[a-zA-Z]+:\/\//)) {
				    url = 'http://' + url;
				}
				request(url, function(error, response, body) {
					if(!error && response.statusCode == 200 && response.headers['content-type'].split(";")[0] == "text/html") {
						var matches = body.match(/<title>(.*?)<\/title>/);
		        		var title = matches[1];
		        		client.say(to, ">> " + title);
					}
				});
				
			}
		};
	});
}