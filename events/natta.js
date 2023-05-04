import { Events } from "discord.js";

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    if (
      message.content.match(
        new RegExp(`^.{0,5}((go+d ?)?nat+a?)(!|(<@)?${message.client.user.username}(>)?|alle|sammen|,| )*$`, "i")
      )
    ) {
      message.channel.send(`natta ${message.author.username}!`);
    }
  },
};
