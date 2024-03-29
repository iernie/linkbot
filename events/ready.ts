import { Events, Client } from "discord.js";
import type { BotEvent } from "../types.d.ts";

const event: BotEvent<Client> = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
  },
};

export default event;
