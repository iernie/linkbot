import { doc, getDoc, getDocs, collection, getFirestore } from "firebase/firestore";
import { SlashCommandBuilder } from "discord.js";

const db = getFirestore();

export default {
  data: new SlashCommandBuilder()
    .setName("1337")
    .setDescription("Check 1337 streaks")
    .addUserOption((option) => option.setName("user").setDescription("the user")),
  async execute(interaction) {
    const user = interaction.options.getUser("user");

    if (user) {
      const docRef = doc(db, interaction.guildId, "counters", "1337", user.id);
      const docSnap = await getDoc(docRef);
      const streak = docSnap.exists() ? docSnap.data().streak : 0;

      interaction.reply(`${user.username} has a streak of ${streak} days`);
    } else {
      const streaks = {};

      const docRef = collection(db, interaction.guildId, "counters", "1337");
      const docSnap = await getDocs(docRef);

      docSnap.forEach((doc) => {
        streaks[doc.id] = { user: doc.data().user, streak: doc.data().streak };
      });

      if (Object.keys(streaks).length === 0) {
        interaction.reply("No 1337 streaks has been collected so far");
      } else {
        const list = Object.keys(streaks).reduce(
          (acc, curr) => [...acc, { user: streaks[curr].user, streak: streaks[curr].streak }],
          []
        );
        const top = list.sort((a, b) => a.count - b.count).slice(0, 5);

        const output = [];

        output.push("Top " + Math.min(top.length, 5));
        top.forEach((u, i) => {
          output.push(`${i + 1}. ${u.user} has a streak of ${u.streak} days`);
        });

        interaction.reply(output.join("\n"));
      }
    }
  },
};
