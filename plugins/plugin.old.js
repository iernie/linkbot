const _ = require('lodash');
const urlParser = require('url');
const moment = require('moment');
const jsonfile = require('jsonfile');
const file = './urls.json';

function appendProtocolIfMissing(url) {
  if (!url.match(/^https?:\/\//)) {
    return `http://${url}`;
  }
  return url;
}

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
      _.map(matches, url => urlParser.parse(appendProtocolIfMissing(url))).forEach(url => {
        if (url.path !== '/') {
          const savedUrl = urls.get(url.href.toLowerCase());
          if (savedUrl !== undefined && savedUrl.channel === to) {
            const days = moment().diff(savedUrl.date, 'days');
            const daysString = days === 1 ? 'dag' : 'dager';
            client.say(to, `${from}, old! Denne lenken ble postet av ${savedUrl.user} for ${days} ${daysString} siden.`);
          } else {
            urls.set(url.href.toLowerCase(), { user: from, date: moment(), channel: to });
            jsonfile.writeFileSync(file, JSON.stringify([...urls]));
          }
        }
      });
    }
  });
};
