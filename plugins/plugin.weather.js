const nodeGeocoder = require('node-geocoder');
const yrno = require('yr.no-forecast');

function currentSummary(client, to, res, query) {
  return (error, summary) => {
    if (!error) {
      const city = res[0].city !== undefined ? res[0].city : query[1].trim();
      client.say(to, `${city}: ${summary.temperature.replace(' celsius', '°C')}`);
    }
  };
}

function weatherLocation(client, to, res, query) {
  return (error, location) => {
    if (!error) {
      location.getCurrentSummary(currentSummary(client, to, res, query));
    }
  };
}

function geoCodeResult(client, to, query) {
  return (error, res) => {
    if (!error && res !== undefined && res.length > 0) {
      yrno.getWeather({
        lat: res[0].latitude,
        lon: res[0].longitude
      }, weatherLocation(client, to, res, query), 1.9);
    }
  };
}

module.exports = (client, plugin) => {
  const geocoder = nodeGeocoder(plugin.options);

  client.addListener('message', (from, to, message) => {
    if (message.match(/^!temp /)) {
      const matches = message.match(/^(\S+)\s(.*)/);
      if (matches !== null) {
        const query = matches.splice(1);
        if (query !== null && query.length > 0 && query[1] !== null && query[1].trim() !== '') {
          geocoder.geocode(query[1].trim(), geoCodeResult(client, to, query));
        }
      }
    }
  });
};
