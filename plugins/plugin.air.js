const nodeGeocoder = require('node-geocoder');
const request = require('request');

const geocoder = nodeGeocoder({ provider: 'google', apiKey: process.env.google_api_key });

function geoCodeResult(message, matches) {
  return (error, res) => {
    if (!error && res !== undefined && res.length > 0) {
      request(`https://api.waqi.info/feed/geo:${res[0].latitude};${res[0].longitude}/?token=${process.env.waqi_token}`, (e, response, body) => {
        if (!e && response.statusCode === 200) {
          const json = JSON.parse(body);
          if (json.status === 'ok') {
            const aqi = json.data.aqi;
            const city = res[0].city !== undefined ? res[0].city : matches[1].trim();
            if (aqi <= 50) message.channel.send(`${city}: Lite helserisiko`);
            else if (aqi <= 100) message.channel.send(`${city}: Moderat helserisiko`);
            else if (aqi <= 150) message.channel.send(`${city}: Middels Helserisiko`);
            else if (aqi <= 200) message.channel.send(`${city}: Høy helserisiko`);
            else if (aqi <= 300) message.channel.send(`${city}: Svært høy helserisiko`);
            else message.channel.send(`${city}: Ekstrem helserisiko`);
          }
        }
      });
    }
  };
}

module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(/^!air (\S.*)/i);
    if (matches) {
      geocoder.geocode(matches[1].trim(), geoCodeResult(message, matches));
    }
  });
};
