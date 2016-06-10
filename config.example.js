module.exports = {
  server: 'irc.quakenet.org',
  nick: 'b0t',
  options: {
    autoConnect: true,
    autoRejoin: true,
    secure: false,
    port: 6667,
    channels: ['#channel']
  },
  plugins: [
    { name: 'pluginName', options: { } }
  ]
};
