const nodeGeocoder = require('node-geocoder');
const yrno = require('yr.no-forecast');
const c = require('chalk');

const geocoder = nodeGeocoder({ provider: 'google', apiKey: process.env.google_api_key });

function currentSummary(message, res, matches) {
  return (error, summary) => {
    if (!error) {
      const city = res[0].city !== undefined ? res[0].city : matches[1].trim();
      const temperature = parseFloat(summary.temperature);
      let text = summary.temperature.replace(' celsius', '°C');
      if (temperature >= 20) text = c.red(text);
      if (temperature > 0) text = c.green(text);
      if (temperature <= 0) text = c.cyan(text);
      if (temperature <= -10) text = c.blue(text);
      message.channel.send(`${city}: ${text}`);
    }
  };
}

function weatherLocation(message, res, matches) {
  return (error, location) => {
    if (!error) {
      location.getCurrentSummary(currentSummary(message, res, matches));
    }
  };
}

function geoCodeResult(message, matches) {
  return (error, res) => {
    if (!error && res !== undefined && res.length > 0) {
      yrno.getWeather({
        lat: res[0].latitude,
        lon: res[0].longitude
      }, weatherLocation(message, res, matches), 1.9);
    }
  };
}

module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(/^!temp (\S.*)/i);
    if (matches !== null) {
      geocoder.geocode(matches[1].trim(), geoCodeResult(message, matches));
    }
  });
};
