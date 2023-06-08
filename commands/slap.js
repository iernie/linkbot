import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("slap")
    .setDescription("Slap someone")
    .addUserOption((option) => option.setName("user").setDescription("the user").setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    interaction.reply(`${interaction.user.username} slaps ${user.username} around a bit with a large trout`);
  },
};
