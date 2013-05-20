var db = require("mongojs").connect("nodebot", ["logs"]);

exports.init = function(client, from, to, message) {
    db.logs.save({
        'channel': to,
        'log': {
            'nick': from,
            'message': message
        }
    });
};