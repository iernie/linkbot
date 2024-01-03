import { Collection, Events, MessageReaction, User } from "discord.js";
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

    let users = new Collection<string, User>();
    try {
      users = await reaction.users.fetch();
    } catch {
      users = reaction.users.cache;
    }

    if (users.size > 0) {
      if (
        reaction.emoji.name === "❌" &&
        reaction.client.user.id === reaction.message.author?.id &&
        users.some((u) => u.id === reaction.message.interaction?.user.id)
      ) {
        try {
          await reaction.message.delete();
        } catch (error) {
          console.error("Something went wrong deleting the message:", error);
        }
      }
    }
  },
};
export default event;
