var quakenet = {
	irc: {
		server: 'irc.quakenet.org',
		port: 6667,
		channels: ['#channel']
	},
	bot: {
		nick: 'b0t',
		name: 'b0tname'
	},
	plugins: {
		"title": {}
	}
};

var freenode = {
	irc: {
		server: 'irc.freenode.net',
		port: 6667,
		channels: ['#channel']
	},
	bot: {
		nick: 'b0t',
		name: 'b0tname'
	},
	plugins: {
		"title": {},
		"logging": {dbName: "dbname", collections: ["col"]}
	}
};

exports.servers = [quakenet, freenode];