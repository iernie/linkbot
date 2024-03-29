import { differenceInCalendarDays, formatDistanceToNow } from "date-fns";
import { doc, updateDoc, getDoc, setDoc, getFirestore, increment } from "firebase/firestore";
import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types.d.ts";

const db = getFirestore();

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("bad")
    .setNameLocalizations({
      no: "slem",
    })
    .setDescription("Check or set someones negative karma")
    .addUserOption((option) => option.setName("user").setDescription("the bad user").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("set new reason")),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    if (reason) {
      const ownRef = doc(db, interaction.guildId!, "counters", "bad", interaction.user.id);
      const ownSnap = await getDoc(ownRef);

      if (ownSnap.exists()) {
        const _result = ownSnap.data();
        if (_result.lastUsedBad && differenceInCalendarDays(new Date(), _result.lastUsedBad.toDate()) < 1) {
          await interaction.reply("You have already used your daily quota");
          return;
        } else {
          await updateDoc(ownRef, {
            lastUsedBad: new Date(),
          });
        }
      } else {
        await setDoc(ownRef, {
          lastUsedBad: new Date(),
        });
      }

      const docRef = doc(db, interaction.guildId!, "counters", "bad", user!.id);
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
      await interaction.reply("Done! 😈");
    } else {
      const docRef = doc(db, interaction.guildId!, "counters", "bad", user!.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const result = docSnap.data();
        const days = formatDistanceToNow(result.lastModified.toDate(), { includeSeconds: true });
        await interaction.reply(`${user!.displayName} was last bad ${days} ago; "${result.reason}" –${result.author}.`);
      } else {
        await interaction.reply(`${user!.displayName} has been good so far :)`);
      }
    }
  },
};

export default command;
