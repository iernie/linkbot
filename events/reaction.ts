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

    const users = await reaction.users.fetch();

    if (
      reaction.emoji.name === "❌" &&
      reaction.client.user.id === reaction.message.author?.id &&
      users.some((u) => u.id === reaction.message.interaction?.user.id)
    ) {
      await reaction.message.delete();
    }
  },
};
export default event;
