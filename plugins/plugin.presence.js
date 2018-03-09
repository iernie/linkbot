const Types = {
  PLAYING: 'PLAYING',
  STREAMING: 'STREAMING',
  LISTENING: 'LISTENING',
  WATCHING: 'WATCHING'
};

const Presences = [
  {
    name: 'with your heart',
    type: Types.PLAYING
  },
  {
    name: 'with your emotions',
    type: Types.PLAYING
  },
  {
    name: 'with fire',
    type: Types.PLAYING
  },
  {
    name: 'it cool',
    type: Types.PLAYING
  },
  {
    name: 'to your conversations',
    type: Types.LISTENING
  },
  {
    name: 'to smooth jazz',
    type: Types.LISTENING
  },
  {
    name: 'you sleep',
    type: Types.WATCHING
  },
  {
    name: 'your every move',
    type: Types.WATCHING
  },
  {
    name: 'TV',
    type: Types.WATCHING
  },
  {
    name: 'a movie',
    type: Types.WATCHING
  }
];

const setPresence = (client) => {
  const presence = Presences[Math.floor(Math.random() * Presences.length)];
  client.user.setPresence({
    game: presence
  });
};

module.exports = (client) => {
  client.on('ready', () => {
    setPresence(client);
    setInterval(() => { setPresence(client); }, 43200000);
  });
};
