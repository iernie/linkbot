var db = require("mongojs").connect("nodebot", ["logs"]);
var moment = require("moment");
var ent = require('ent');

exports.init = function(client, from, to, message) {
    db.logs.save({
        'channel': to,
    	'date': moment().format("YYYY/MM/DD HH:mm:ss"),
        'nick': from,
        'message': ent.encode(message)
    });
};