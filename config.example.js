exports.servers = {

	'quakenet': {
		irc: {
			server: 'irc.quakenet.org',
			port: 6667,
			channels: ['#channel']
		},
		bot: {
			nick: 'b0t',
			name: 'b0tname'
		},
		database: 'databasename',
		plugins: {
			"title": {}
		}
	},

	'freenode': {
		irc: {
			server: 'irc.freenode.net',
			port: 6667,
			channels: ['#channel']
		},
		bot: {
			nick: 'b0t',
			name: 'b0tname'
		},
		database: 'databasename',
		plugins: {
			"title": {},
			"logging": {collection: "col"}
		}
	}
};