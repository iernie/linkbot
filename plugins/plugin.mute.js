const Mute = Parse.Object.extend('Mute');

module.exports = (client) => {
  client.on('message', async (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(/!mute #?(\S+)/i);
    if (matches) {
      const channel = client.channels.cache.find('name', matches[1]);

      if (channel) {
        const query = new Parse.Query(Mute);
        query.equalTo('channel', channel.id);
        const result = await query.first();
        if (result) {
          result.destroy();
          message.react('🔊');
        } else {
          const muteObject = new Mute();
          muteObject.set('channel', channel.id);
          muteObject.save();
          message.react('🔇');
        }
      }
    }
  });
};
