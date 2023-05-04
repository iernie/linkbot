import { Events } from 'discord.js';

export default {
  name: Events.ClientReady,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
  }
}