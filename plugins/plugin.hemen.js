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
        request("http://hemmis.444.no/hemensier/", parseBody);
    }
};
