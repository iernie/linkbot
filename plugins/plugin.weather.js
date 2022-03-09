const fetch = require('node-fetch');
const nodeGeocoder = require('node-geocoder');

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
          const data = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${location[0].latitude}&lon=${location[0].longitude}`, { headers: { 'User-Agent': 'linkbot' } }).then((res) => res.json());
          if (data && data.properties && data.properties.timeseries && data.properties.timeseries.length > 0) {
            const city = location[0].city !== undefined ? location[0].city : matches[1].trim();
            message.channel.send(`${city}: ${data.properties.timeseries[0].data.instant.details.air_temperature}°C`);
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
