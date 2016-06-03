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

exports.init = function(client, from, to, message) {
    var split_message = message.split(" ");
    var parseBody = function(error, response, body) {
        if(!error && response.statusCode === 200) {
            var contentType = response.headers['content-type'];
            if(contentType === undefined || contentType.split(";")[0] === "text/html") {
                var matches = getTitle(body);
                if (matches !== null) {
                    var title = matches[1];
                    client.say(to, ">> " + ent.decode(title));
                }
            }
        }
    };
    
    for (var i = split_message.length - 1; i >= 0; i--) {
        if(isURL(split_message[i])) {
            var url = appendProtocolIfMissing(split_message[i]);
            request(url, parseBody);
        }
    }
};
