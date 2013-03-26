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
	plugins: ["title"]
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
	plugins: ["title"]
};

exports.servers = [quakenet, freenode];