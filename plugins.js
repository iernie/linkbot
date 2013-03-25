var plugins = ["title", "8ball"];

exports.init = function(client) {
	for (var i = plugins.length - 1; i >= 0; i--) {
		var tempPlugin = require('./plugins/plugin.' + plugins[i] + ".js");
		tempPlugin.init(client);
	};
}