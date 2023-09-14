import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types.d.ts";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("slap")
    .setDescription("Slap someone")
    .addUserOption((option) => option.setName("user").setDescription("the user").setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    await interaction.reply(
      `${interaction.user.displayName} slaps ${user?.displayName} around a bit with a large trout`,
    );
  },
};

export default command;
