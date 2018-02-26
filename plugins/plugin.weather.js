const nodeGeocoder = require('node-geocoder');
const yrno = require('yr.no-forecast')({
  version: '1.9',
  request: {
    timeout: 15000
  }
});

const geocoder = nodeGeocoder({ provider: 'google', apiKey: process.env.google_api_key });

module.exports = (client) => {
  client.on('message', async (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(/^!temp (\S.*)/i);
    if (matches) {
      try {
        const location = await geocoder.geocode(matches[1].trim());
        if (location && location.length > 0) {
          const weather = await yrno.getWeather({
            lat: location[0].latitude,
            lon: location[0].longitude
          });
          const summary = await weather.getForecastForTime(new Date());
          const city = location[0].city !== undefined ? location[0].city : matches[1].trim();
          message.channel.send(`${city}: ${summary.temperature.value}°C'`);
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
};
