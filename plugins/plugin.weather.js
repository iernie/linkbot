const nodeGeocoder = require('node-geocoder');
const yrno = require('yr.no-forecast')();

const geocoder = nodeGeocoder({ provider: 'openstreetmap' });

module.exports = (client) => {
  client.on('message', async (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(/^!temp (\S.*)/i);
    if (matches) {
      message.channel.startTyping();
      try {
        const location = await geocoder.geocode(matches[1].trim());
        if (location && location.length > 0) {
          const weather = await yrno.getWeather({
            lat: location[0].latitude,
            lon: location[0].longitude
          });
          const summary = await weather.getForecastForTime(new Date());
          if (summary && summary.temperature) {
            const city = location[0].city !== undefined ? location[0].city : matches[1].trim();
            message.channel.send(`${city}: ${summary.temperature.value}°C`);
          } else {
            message.react('🤷');
          }
        }
      } catch (err) {
        console.log('weather', err);
      }
      message.channel.stopTyping();
    }

    if (message.content.match(/^!help/i)) {
      message.channel.send('!temp [location]');
    }
  });
};
