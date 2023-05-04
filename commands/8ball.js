import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Choose a decision")
    .addStringOption((option) => option.setName("choices").setDescription("what are your choices?").setRequired(true)),
  async execute(interaction) {
    const queries = interaction.options
      .getString("choices")
      .split(/\|| or | eller /i)
      .map((val) => val.replace(/\?$/, "").trim());
    const random = Math.floor(Math.random() * queries.length);
    interaction.reply(queries[random]);
  },
};
