const forever = require('forever-monitor');

const child = new (forever.Monitor)('bot.js', {
  max: 3,
  silent: true,
  args: []
});

child.on('exit', () => {
  console.log('bot.js has exited after 3 restarts');
});

child.start();
