exports.init = function(pluginName, client, from, to, message) {
	var plugin = require('./plugins/plugin.' + pluginName + ".js");
	plugin.init(client, from, to, message);
};