var request = require('request');
var ent = require('ent');

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

function appendProtocolIfMissing(str) {
    if (!str.match(/^[a-zA-Z]+:\/\//)) {
        return 'http://' + str;
    }
    return str;
}

function getTitle(str) {
    return str.match(/<title>\s*(.*?)\s*<\/title>/im);
}

var parseBody = function(error, response, body) {
    if(!error && response.statusCode == 200 && response.headers['content-type'].split(";")[0] == "text/html") {
        var matches = getTitle(body);
        if (matches !== null) {
            var title = matches[1];
            client.say(to, ">> " + ent.decode(title));
        }
        
    }
};

exports.init = function(client) {
    client.addListener('message', function(nick, to, text, message) {
        var texts = text.split(" ");
        for (var i = texts.length - 1; i >= 0; i--) {
            if(isURL(texts[i])) {
                var url = appendProtocolIfMissing(texts[i]);
                request(url, parseBody);
            }
        }
    });
};