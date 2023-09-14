import { formatDistanceToNow } from "date-fns";
import { doc, updateDoc, getDoc, setDoc, getFirestore, increment } from "firebase/firestore";
import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types.d.ts";

const db = getFirestore();

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("good")
    .setNameLocalizations({
      no: "snill",
    })
    .setDescription("Check or set someones positive karma")
    .addUserOption((option) => option.setName("user").setDescription("the good user").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("set new reason")),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    if (reason) {
      if (user!.id === interaction.user.id) {
        await interaction.reply("Tsk, tsk! You cannot /good yourself. 👼");
      } else {
        const docRef = doc(db, interaction.guildId!, "counters", "good", user!.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          await updateDoc(docRef, {
            user: user!.displayName,
            count: increment(1),
            author: interaction.user.displayName,
            authorId: interaction.user.id,
            reason: reason,
            lastModified: new Date(),
          });
        } else {
          await setDoc(docRef, {
            user: user!.displayName,
            count: 1,
            author: interaction.user.displayName,
            authorId: interaction.user.id,
            reason: reason,
            lastModified: new Date(),
            createdAt: new Date(),
          });
        }
        await interaction.reply("Done! 👼");
      }
    } else {
      const docRef = doc(db, interaction.guildId!, "counters", "good", user!.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const result = docSnap.data();
        const days = formatDistanceToNow(result.lastModified.toDate(), { includeSeconds: true });
        await interaction.reply(
          `${user!.displayName} was last good ${days} ago; "${result.reason}" –${result.author}.`,
        );
      } else {
        await interaction.reply(`${user!.displayName} has no recorded good :/`);
      }
    }
  },
};

export default command;
