import { formatDistanceToNow, getMonth, getDate, getYear } from "date-fns";
import { Events, Message } from "discord.js";
import nb from "date-fns/locale/nb/index.js";
import type { BotEvent } from "../types.d.ts";

const event: BotEvent<Message> = {
  name: Events.MessageCreate,
  async execute(message) {
    const time = new Date(message.createdTimestamp);
    const match = message.content.match(new RegExp("^.{0,5}((godt ?nytt ?år)|(happy ?new ?year))(.*)?$", "i"));
    if (match && match[0] !== "") {
      if (getMonth(time) === 0) {
        await message.channel.send(`Godt nytt år ${message.author.displayName}!`);
      } else if (getMonth(time) === 11 && getDate(time) === 31) {
        await message.channel.send(
          `Godt nytt år ${message.author.displayName}! Det er ${formatDistanceToNow(
            new Date(getYear(time) + 1, 0, 1, 0, 0, 0, 0),
            { includeSeconds: true, locale: nb },
          )} igjen til midnatt!`,
        );
      } else {
        await message.channel.send(
          `Du er for tidlig! Det er ${formatDistanceToNow(new Date(getYear(time) + 1, 0, 1, 0, 0, 0, 0), {
            includeSeconds: true,
            locale: nb,
          })} igjen.`,
        );
      }
    }
  },
};

export default event;
