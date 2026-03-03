import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types.d.ts";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("slap")
    .setDescription("Slap someone")
    .addUserOption((option) =>
      option.setName("user").setDescription("the user").setRequired(true),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    let users = null;
    try {
      users = await interaction.guild?.members.fetch();
    } catch (e) {}
    await interaction.reply(
      `${users?.find((u) => u.id === interaction.user.id)?.nickname ?? interaction.user.displayName} slaps ${users?.find((u) => u.id === user!.id)?.nickname ?? user?.displayName} around a bit with a large trout`,
    );
  },
};

export default command;
