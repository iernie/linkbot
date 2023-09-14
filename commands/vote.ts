import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types.d.ts";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Democracy, innit?")
    .addStringOption((option) => option.setName("question").setDescription("what is your question?").setRequired(true)),
  async execute(interaction) {
    const message = await interaction.reply({ content: interaction.options.getString("question")!, fetchReply: true });
    await message.react("👍");
    await message.react("👎");
  },
};

export default command;
