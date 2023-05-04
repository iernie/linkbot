import { differenceInCalendarDays, formatDistanceToNow } from "date-fns";
import { doc, updateDoc, getDoc, setDoc, getFirestore } from "firebase/firestore";
import { SlashCommandBuilder } from "discord.js";

const db = getFirestore();

export default {
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
      const ownRef = doc(db, interaction.guildId, "counters", "bad", interaction.user.id);
      const ownSnap = await getDoc(ownRef);

      if (ownSnap.exists()) {
        const _result = ownSnap.data();
        if (_result.lastUsedBad && differenceInCalendarDays(new Date(), _result.lastUsedBad.toDate()) < 1) {
          interaction.reply("You have already used your daily quota");
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

      const docRef = doc(db, interaction.guildId, "counters", "bad", user.id);
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
      interaction.reply("Done! 😈");
    } else {
      const docRef = doc(db, interaction.guildId, "counters", "bad", user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const result = docSnap.data();
        const days = formatDistanceToNow(result.lastModified.toDate(), { includeSeconds: true });
        interaction.reply(`${user.username} was last bad ${days} ago; "${result.reason}" –${result.author}.`);
      } else {
        interaction.reply(`${user.username} has been good :)`);
      }
    }
  },
};
