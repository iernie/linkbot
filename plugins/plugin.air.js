const nodeGeocoder = require('node-geocoder');
const request = require('request');

const geocoder = nodeGeocoder({ provider: 'google', apiKey: process.env.google_api_key });

const Level = {
  UNKNOWN: 0,
  LOW: 1,
  MODERATE: 2,
  HIGH: 3,
  EXTREME: 4
};

const getLevel = (currentLevel, level) => {
  if (level > currentLevel) {
    return level;
  }
  return currentLevel;
};

const unit = 'µg/m³';

module.exports = (client) => {
  client.on('message', async (message) => {
    if (message.author.bot) return;

    const matches = message.content.match(/^!air (\S.*)/i);
    if (matches) {
      try {
        const location = await geocoder.geocode(matches[1].trim());
        if (location && location.length > 0) {
          request(`https://api.openaq.org/v1/measurements?coordinates=${location[0].latitude},${location[0].longitude}`, (e, response, body) => {
            if (!e && response.statusCode === 200) {
              const json = JSON.parse(body);
              let level = Level.UNKNOWN;
              if (json && json.results.filter(result => result.unit === unit).length > 0) {
                json.results.filter(result => result.unit === unit).forEach((result) => {
                  switch (result.parameter) {
                    case 'pm10':
                      if (result.value < 50) {
                        level = getLevel(level, Level.LOW);
                      }
                      if (result.value >= 50 && result.value < 80) {
                        level = getLevel(level, Level.MODERATE);
                      }
                      if (result.value >= 80 && result.value <= 400) {
                        level = getLevel(level, Level.HIGH);
                      }
                      if (result.value > 400) {
                        level = getLevel(level, Level.EXTREME);
                      }
                      break;
                    case 'no2':
                      if (result.value < 100) {
                        level = getLevel(level, Level.LOW);
                      }
                      if (result.value >= 100 && result.value < 200) {
                        level = getLevel(level, Level.MODERATE);
                      }
                      if (result.value >= 200 && result.value <= 400) {
                        level = getLevel(level, Level.HIGH);
                      }
                      if (result.value > 400) {
                        level = getLevel(level, Level.EXTREME);
                      }
                      break;
                    case 'pm25':
                      if (result.value < 25) {
                        level = getLevel(level, Level.LOW);
                      }
                      if (result.value >= 25 && result.value < 40) {
                        level = getLevel(level, Level.MODERATE);
                      }
                      if (result.value >= 40 && result.value <= 150) {
                        level = getLevel(level, Level.HIGH);
                      }
                      if (result.value > 150) {
                        level = getLevel(level, Level.EXTREME);
                      }
                      break;
                    case 'so2':
                      if (result.value < 100) {
                        level = getLevel(level, Level.LOW);
                      }
                      if (result.value >= 100 && result.value < 350) {
                        level = getLevel(level, Level.MODERATE);
                      }
                      if (result.value >= 350 && result.value <= 500) {
                        level = getLevel(level, Level.HIGH);
                      }
                      if (result.value > 500) {
                        level = getLevel(level, Level.EXTREME);
                      }
                      break;
                    case 'o3':
                      if (result.value < 100) {
                        level = getLevel(level, Level.LOW);
                      }
                      if (result.value >= 100 && result.value < 180) {
                        level = getLevel(level, Level.MODERATE);
                      }
                      if (result.value >= 180 && result.value <= 240) {
                        level = getLevel(level, Level.HIGH);
                      }
                      if (result.value > 240) {
                        level = getLevel(level, Level.EXTREME);
                      }
                      break;
                    default:
                      break;
                  }
                });
              }
              const city = location[0].city !== undefined ? location[0].city : matches[1].trim();
              if (level === Level.LOW) message.channel.send(`${city}: Liten eller ingen helserisiko`);
              else if (level === Level.MODERATE) message.channel.send(`${city}: Moderat helserisiko`);
              else if (level === Level.HIGH) message.channel.send(`${city}: Betydelig helserisiko`);
              else if (level === Level.EXTREME) message.channel.send(`${city}: Alvorlig helserisiko`);
              else message.channel.send(`${city}: Ukjent helserisiko`);
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
};
