const Mute = Parse.Object.extend('Mute');

module.exports = (channelId) => {
  const mute = new Parse.Query(Mute);
  mute.equalTo('channel', channelId);
  return mute.first();
};
