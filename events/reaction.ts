import { Events, MessageReaction } from "discord.js";
import type { BotEvent } from "../types.js";

const event: BotEvent<MessageReaction> = {
  name: Events.MessageReactionAdd,
  async execute(reaction) {
    console.log(reaction);
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error("Something went wrong when fetching the message:", error);
        return;
      }
    }

    console.log(reaction.client.user.id, reaction.message.author?.id);
    if (reaction.client.user.id === reaction.message.author?.id) {
      // await reaction.message.delete();
    }
  },
};
export default event;
