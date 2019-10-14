const fetch = require('node-fetch');
const nodeGeocoder = require('node-geocoder');
const parser = require('fast-xml-parser');

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
          const data = await fetch(`https://api.met.no/weatherapi/locationforecast/1.9/?lat=${location[0].latitude}&lon=${location[0].longitude}`).then((res) => res.text());
          if (data && parser.validate(data)) {
            const json = parser.parse(data, { parseAttributeValue: true, ignoreAttributes: false, attributeNamePrefix: '' });
            if (json && json.weatherdata && json.weatherdata.product && json.weatherdata.product.time && json.weatherdata.product.time.length > 0) {
              const city = location[0].city !== undefined ? location[0].city : matches[1].trim();
              message.channel.send(`${city}: ${json.weatherdata.product.time[0].location.temperature.value}°C`);
            } else {
              message.react('🤷');
            }
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
