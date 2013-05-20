var db = require("mongojs").connect("nodebot", ["logs"]);
var moment = require("moment");

exports.init = function(client, from, to, message) {
    db.logs.save({
        'channel': to,
        'log': {
        	'date': moment().format("YYYY/MM/DD HH:mm:ss"),
            'nick': from,
            'message': encodeURIComponent(message)
        }
    });
};