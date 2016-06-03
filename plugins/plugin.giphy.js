var request = require('request');

exports.init = function(client, from, to, message) {
    var parseBody = function(error, response, body) {
        if(!error && response.statusCode === 200) {
            var contentType = response.headers['content-type'];
            if(contentType.split(";")[0] === "application/json") {
                var json = JSON.parse(body);
                if(json.data.length !== 0) {
                    client.say(to, json.data.image_original_url);
                }
            }
        }
    }
    if(message.match(/^!giphy/)) {
        var matches = message.match(/^(\S+)\s(.*)/);
        if(matches !== null) {
            var query = matches.splice(1);
            if(query !== null && query.length > 0 && query[1] !== null && query[1].trim() !== '') {
                request("http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag="+query[1].trim().replace(/ /g, "+"), parseBody);
            }
        }
    }
};
