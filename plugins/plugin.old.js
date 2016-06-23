const moment = require('moment');
const jsonfile = require('jsonfile');
const file = './urls.json';

function isURL(str) {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
  '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return pattern.test(str);
}

module.exports = (client) => {
  let urls = new Map();
  jsonfile.readFile(file, (err, obj) => {
    if (!err) {
      urls = new Map(JSON.parse(obj));
    }
  });

  client.addListener('message', (from, to, message) => {
    const splitMessages = message.split(' ');
    splitMessages.forEach(splitMessage => {
      if (isURL(splitMessage)) {
        const url = splitMessage.trim().replace(/^https?:\/\//ig, '').toLowerCase();
        const savedUrl = urls.get(url);
        if (savedUrl !== undefined) {
          client.say(to, `${from}, old! Denne lenken ble postet av ${savedUrl.user} for ${moment().diff(savedUrl.date, 'days')} dager siden.`);
        } else {
          urls.set(url, { user: from, date: moment() });
          jsonfile.writeFileSync(file, JSON.stringify([...urls]));
        }
      }
    });
  });
};
