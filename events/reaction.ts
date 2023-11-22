import { Events, MessageReaction, User } from "discord.js";
import type { BotEvent } from "../types.js";

const event: BotEvent<MessageReaction> = {
  name: Events.MessageReactionAdd,
  async execute(reaction) {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error("Something went wrong when fetching the message:", error);
        return;
      }
    }

    console.log(
      reaction.client.user.id,
      reaction.message.author?.id,
      reaction.users.cache,
      reaction.message.interaction?.user.id,
    );
    if (reaction.emoji.name === "❌" && reaction.client.user.id === reaction.message.author?.id) {
      await reaction.message.delete();
    }
  },
};
export default event;
