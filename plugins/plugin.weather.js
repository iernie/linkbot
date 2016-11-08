const nodeGeocoder = require('node-geocoder');
const yrno = require('yr.no-forecast');

function currentSummary(client, to, res, matches, say) {
  return (error, summary) => {
    if (!error) {
      const city = res[0].city !== undefined ? res[0].city : matches[1].trim();
      say(to, `${city}: ${summary.temperature.replace(' celsius', '°C')}`);
    }
  };
}

function weatherLocation(client, to, res, matches, say) {
  return (error, location) => {
    if (!error) {
      location.getCurrentSummary(currentSummary(client, to, res, matches, say));
    }
  };
}

function geoCodeResult(client, to, matches, say) {
  return (error, res) => {
    if (!error && res !== undefined && res.length > 0) {
      yrno.getWeather({
        lat: res[0].latitude,
        lon: res[0].longitude
      }, weatherLocation(client, to, res, matches, say), 1.9);
    }
  };
}

module.exports = (client, say, plugin) => {
  const geocoder = nodeGeocoder(plugin.options);

  client.addListener('message', (from, to, message) => {
    const matches = message.match(/^!temp (\S.*)/i);
    if (matches !== null) {
      geocoder.geocode(matches[1].trim(), geoCodeResult(client, to, matches, say));
    }
  });
};
