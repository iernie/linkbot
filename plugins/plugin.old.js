const moment = require('moment');
const jsonfile = require('jsonfile');
const file = './urls.json';

module.exports = (client) => {
  const pattern = new RegExp('(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?', 'ig'); // fragment locator

  let urls = new Map();
  jsonfile.readFile(file, (err, obj) => {
    if (!err) {
      urls = new Map(JSON.parse(obj));
    }
  });

  client.addListener('message', (from, to, message) => {
    const matches = message.match(pattern);
    if (matches !== null) {
      _.map(matches, url => url.trim().replace(/^https?:\/\//ig, '').toLowerCase()).forEach(url => {
        const savedUrl = urls.get(url);
        if (savedUrl !== undefined && savedUrl.channel === to) {
          client.say(to, `${from}, old! Denne lenken ble postet av ${savedUrl.user} for ${moment().diff(savedUrl.date, 'days')} dager siden.`);
        } else {
          urls.set(url, { user: from, date: moment(), channel: to });
          jsonfile.writeFileSync(file, JSON.stringify([...urls]));
        }
      });
    }
  });
};
