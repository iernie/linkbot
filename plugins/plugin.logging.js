var mongojs = require('mongojs');
var moment = require("moment");
var ent = require('ent');

exports.init = function(client, from, to, message, config) {
	var db = mongojs(config.dbName, config.collections);

    db[config.collections[0]].save({
        'channel': to,
    	'date': moment().format("YYYY/MM/DD HH:mm:ss"),
        'nick': from,
        'message': ent.encode(message)
    });
};