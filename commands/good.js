import { formatDistanceToNow } from "date-fns";
import { doc, updateDoc, getDoc, setDoc, getFirestore } from "firebase/firestore";
import { SlashCommandBuilder } from "discord.js";

const db = getFirestore();

export default {
  data: new SlashCommandBuilder()
    .setName("good")
    .setDescription("Check or set someones positive karma")
    .addUserOption((option) => option.setName("user").setDescription("the good user").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("set new reason")),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    if (reason) {
      if (user.id === interaction.user.id) {
        interaction.reply("Tsk, tsk! You cannot /good yourself. 👼");
      } else {
        const docRef = doc(db, interaction.guildId, "counters", "good", user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const result = docSnap.data();
          await updateDoc(docRef, {
            user: user.username,
            count: result.count ?? 0 + 1,
            author: interaction.user.username,
            authorId: interaction.user.id,
            reason: reason,
            lastModified: new Date(),
          });
        } else {
          await setDoc(docRef, {
            user: user.username,
            count: 1,
            author: interaction.user.username,
            authorId: interaction.user.id,
            reason: reason,
            lastModified: new Date(),
            createdAt: new Date(),
          });
        }
        interaction.reply("Done! 👼");
      }
    } else {
      const docRef = doc(db, interaction.guildId, "counters", "good", user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const result = docSnap.data();
        const days = formatDistanceToNow(result.lastModified.toDate(), { includeSeconds: true });
        interaction.reply(`${user.username} was last good ${days} ago; "${result.reason}" –${result.author}.`);
      } else {
        interaction.reply(`${user.username} has not been good :(`);
      }
    }
  },
};
