const nodeGeocoder = require('node-geocoder');
const request = require('request');
const format = require('date-fns/format');
const nb = require('date-fns/locale/nb');

const geocoder = nodeGeocoder({ provider: 'google', apiKey: process.env.google_api_key });

const Level = {
  UNKNOWN: 0,
  LOW: 1,
  MODERATE: 2,
  HIGH: 3,
  EXTREME: 4
};

const threshold = (low, moderate, high) => {
  return (value) => {
    if (value < low) {
      return Level.LOW;
    }
    if (value >= low && value < moderate) {
      return Level.MODERATE;
    }
    if (value >= moderate && value <= high) {
      return Level.HIGH;
    }
    if (value > high) {
      return Level.EXTREME;
    }
    return Level.UNKNOWN;
  };
};

const pm10 = threshold(50, 80, 400);
const no2 = threshold(100, 200, 400);
const pm25 = threshold(25, 40, 150);
const so2 = threshold(100, 350, 500);
const o3 = threshold(100, 180, 240);

const getLevel = (parameter, value) => {
  switch (parameter) {
    case 'pm10':
      return pm10(value);
    case 'no2':
      return no2(value);
    case 'pm25':
      return pm25(value);
    case 'so2':
      return so2(value);
    case 'o3':
      return o3(value);
    default:
      return Level.UNKNOW;
  }
};

module.exports = (client) => {
  client.on('message', async (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(/^!air (\S.*)/i);
    if (matches) {
      try {
        const location = await geocoder.geocode(matches[1].trim());
        if (location && location.length > 0) {
          request(`https://api.openaq.org/v1/measurements?radius=10000&date_from=${format(new Date(), 'YYYY-MM-DD', { locale: nb })}&coordinates=${location[0].latitude},${location[0].longitude}`, (e, response, body) => {
            if (!e && response.statusCode === 200) {
              const json = JSON.parse(body);

              if (json && json.results.length > 0) {
                const level = Math.max(...json.results.map(result => getLevel(result.parameter, result.value)));

                const city = location[0].city !== undefined ? location[0].city : matches[1].trim();
                if (level === Level.LOW) message.channel.send(`${city}: Liten eller ingen helserisiko`);
                else if (level === Level.MODERATE) message.channel.send(`${city}: Moderat helserisiko`);
                else if (level === Level.HIGH) message.channel.send(`${city}: Betydelig helserisiko`);
                else if (level === Level.EXTREME) message.channel.send(`${city}: Alvorlig helserisiko`);
                else message.channel.send(`${city}: Ukjent helserisiko`);
              }
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
};
