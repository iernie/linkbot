import { Events, MessageReaction } from "discord.js";
import type { BotEvent } from "../types.js";

const event: BotEvent<MessageReaction> = {
  name: Events.MessageReactionAdd,
  async execute(reaction, user) {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error("Something went wrong when fetching the message:", error);
        return;
      }
    }

    console.log(user);

    // Now the message has been cached and is fully available
    console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
    // The reaction is now also fully available and the properties will be reflected accurately:
    console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
  },
};
export default event;
