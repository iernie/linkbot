const nodeGeocoder = require('node-geocoder');
const request = require('request');
const c = require('irc-colors');

function geoCodeResult(client, to, matches, say, token) {
  return (error, res) => {
    if (!error && res !== undefined && res.length > 0) {
      request(`https://api.waqi.info/feed/geo:${res[0].latitude};${res[0].longitude}/?token=${token}`, (e, response, body) => {
        if (!e && response.statusCode === 200) {
          const json = JSON.parse(body);
          if (json.status === 'ok') {
            const aqi = json.data.aqi;
            const city = res[0].city !== undefined ? res[0].city : matches[1].trim();
            if (aqi <= 50) say(to, `${city}: ${c.green('Lite helserisiko')}`);
            else if (aqi <= 100) say(to, `${city}: ${c.yellow('Moderat helserisiko')}`);
            else if (aqi <= 150) say(to, `${city}: ${c.brown('Middels Helserisiko')}`);
            else if (aqi <= 200) say(to, `${city}: ${c.red('Høy helserisiko')}`);
            else if (aqi <= 300) say(to, `${city}: ${c.purple('Svært høy helserisiko')}`);
            else say(to, `${city}: ${c.rainbow('Ekstrem helserisiko')}`);
          }
        }
      });
    }
  };
}

module.exports = (client, say, plugin) => {
  const geocoder = nodeGeocoder(plugin.options);

  client.addListener('message', (from, to, message) => {
    const matches = message.match(/^!air (\S.*)/i);
    if (matches !== null) {
      geocoder.geocode(matches[1].trim(), geoCodeResult(client, to, matches, say, plugin.token));
    }
  });
};
