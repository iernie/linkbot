var moment = require("moment");
var ent = require('ent');

exports.init = function(client, from, to, message, db, kwargs) {
	db.collection(kwargs.collection).save({
        'channel': to,
    	'date': moment().format("YYYY/MM/DD HH:mm:ss"),
        'nick': from,
        'message': ent.encode(message)
    });
};