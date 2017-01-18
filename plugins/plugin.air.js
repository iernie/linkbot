const luftkvalitet = require('luftkvalitet');
const c = require('irc-colors');

module.exports = (client, say) => {
  client.addListener('message', (from, to, message) => {
    const matches = message.match(/^!air (\S.*)/i);
    if (matches !== null) {
      const location = matches[1].trim();
      luftkvalitet({ type: 'Country' }, (error, array) => {
        if (!error) {
          array
            .filter(x => x.Name.toLowerCase() === location.toLowerCase())
            .forEach((data) => {
              let text;
              switch (data.Text) {
                case 'Lite':
                  text = c.green(data.ShortDescription);
                  break;
                case 'Moderat':
                  text = c.brown(data.ShortDescription);
                  break;
                case 'Høy':
                  text = c.red(data.ShortDescription);
                  break;
                case 'Svært høy':
                  text = c.purple(data.ShortDescription);
                  break;
                default:
                  text = data.ShortDescription;
                  break;
              }
              say(to, `${data.Name}: ${text}`);
            });
        }
      });
    }
  });
};
