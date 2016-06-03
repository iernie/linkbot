var NodeGeocoder = require('node-geocoder');
var yrno = require('yr.no-forecast');

var options = {
    provider: 'google',
    apiKey: 'AIzaSyCORS4jfMej-GD_tUA9hXVDc2bFY1VMUWY'
};
var geocoder = NodeGeocoder(options);

exports.init = function(client, from, to, message) {
    if(message.match(/^!temp/)) {
        var matches = message.match(/^(\S+)\s(.*)/);
        if(matches !== null) {
            var query = matches.splice(1);
            if(query !== null && query.length > 0 && query[1] !== null && query[1].trim() !== '') {
                geocoder.geocode(query[1].trim(), function(err, res) {
                    if(!err && res !== undefined && res.length > 0) {
                        yrno.getWeather({
                            lat: res[0].latitude,
                            lon: res[0].longitude
                        }, function(errr, loc) {
                            if(!errr) {
                                loc.getCurrentSummary(function(errrr, summary) {
                                    if(!errrr) {
                                        var city = res[0].city !== undefined ? res[0].city : query[1].trim();
                                        client.say(to, city + ": " + summary.temperature.replace(" celsius", "°C"));
                                    }
                                });
                            }
                        }, 1.9);
                    }
                });
            }
        }
    }
};
