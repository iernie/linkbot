import { addDoc, getFirestore, collection } from "firebase/firestore";
import { SlashCommandBuilder } from "discord.js";
import * as chrono from "chrono-node";
import { formatDistanceToNow } from "date-fns";

const db = getFirestore();

export default {
  data: new SlashCommandBuilder()
    .setName("remindme")
    .setDescription("Set a reminder")
    .addStringOption((option) =>
      option.setName("when").setDescription("when do you want to be reminded?").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("what").setDescription("what do you want to remember").setRequired(true)
    ),
  async execute(interaction) {
    const when = chrono.parseDate(interaction.options.getString("when"));
    const what = interaction.options.getString("what");

    if (!when) {
      await interaction.reply({ content: "I did not understand when you wanted it", ephemeral: true });
    } else {
      await addDoc(collection(db, "reminders"), {
        user: interaction.user.id,
        guildId: interaction.guildId,
        channelId: interaction.channelId,
        what: what,
        when: when,
      });

      interaction.reply(`Got it! I'll remind you "${what}" in ${formatDistanceToNow(when)}`);
    }
  },
};
