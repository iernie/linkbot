var quakenet = {
	irc: {
		server: 'irc.quakenet.org',
		port: 6667,
		channels: ['#channel']
	},
	bot: {
		nick: 'b0t',
		name: 'b0tname'
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
	}
};

exports.servers = [quakenet, freenode];