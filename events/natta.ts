import { Events, Message } from "discord.js";
import type { BotEvent } from "../types.d.ts";

const event: BotEvent<Message> = {
  name: Events.MessageCreate,
  async execute(message) {
    if (!message.member || message.member.user.bot) return;
    if (!message.guild) return;
    
    if (
      message.content.match(
        new RegExp(
          `^.{0,5}((go+d ?)?nat+a?)(!|(<@)?${message.client.user.displayName}(>)?|dere|alle|sammen|,| )*$`,
          "i",
        ),
      )
    ) {
      await message.channel.send(`natta ${message.author.displayName}!`);
    }
  },
};

export default event;
