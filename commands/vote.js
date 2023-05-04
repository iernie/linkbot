import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Democracy, innit?")
    .addStringOption((option) => option.setName("question").setDescription("what is your question?").setRequired(true)),
  async execute(interaction) {
    const message = await interaction.reply({ content: interaction.options.getString("question"), fetchReply: true });
    message.react("👍");
    message.react("👎");
  },
};
