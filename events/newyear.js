import { formatDistanceToNow, getMonth, getDate, getYear } from "date-fns";
import { Events } from "discord.js";
import nb from "date-fns/locale/nb/index.js";

export default {
  name: Events.MessageCreate,
  async execute(message) {
    const time = new Date(message.createdTimestamp);
    const match = message.content.match(new RegExp("^.{0,5}((godt ?nytt ?år)|(happy ?new ?year))(.*)?$", "i"));
    if (match && match[0] !== "") {
      if (getMonth(time) === 0) {
        message.channel.send(`Godt nytt år ${message.author.username}!`);
      } else if (getMonth(time) === 11 && getDate(time) === 31) {
        message.channel.send(
          `Godt nytt år ${message.author.username}! Det er ${formatDistanceToNow(
            new Date(getYear(time) + 1, 0, 1, 0, 0, 0, 0),
            { includeSeconds: true, locale: nb }
          )} igjen til midnatt!`
        );
      } else {
        message.channel.send(
          `Du er for tidlig! Det er ${formatDistanceToNow(new Date(getYear(time) + 1, 0, 1, 0, 0, 0, 0), {
            includeSeconds: true,
            locale: nb,
          })} igjen.`
        );
      }
    }
  },
};