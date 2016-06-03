var request = require('request');
var ent = require('ent');

exports.init = function(client, from, to, message) {
    var parseBody = function(error, response, body) {
        if(!error && response.statusCode === 200) {
            var contentType = response.headers['content-type'];
            if(contentType.split(";")[0] === "text/html") {
                client.say(to, ent.decode(body));
            }
        }
    }
    if(message.match(/^!hemen/)) {
        var matches = message.match(/^(\S+)\s(.*)/);
        if(matches !== null) {
            var query = matches.splice(1);
            if(query !== null && query.length > 0 && query[1] !== null && query[1].trim() !== '') {
                request("http://hemmis.444.no/hemensier/search?q="+query[1].trim(), parseBody);
            } else {
                request("http://hemmis.444.no/hemensier/", parseBody);
            }
        } else {
            request("http://hemmis.444.no/hemensier/", parseBody)
        }
    }
};
