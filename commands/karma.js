import { doc, getDoc, getDocs, collection, getFirestore } from "firebase/firestore";
import { SlashCommandBuilder } from "discord.js";

const db = getFirestore();

export default {
  data: new SlashCommandBuilder()
    .setName("karma")
    .setDescription("Check all or someones karma")
    .addUserOption((option) => option.setName("user").setDescription("the user")),
  async execute(interaction) {
    const user = interaction.options.getUser("user");

    if (user) {
      if (user.id === interaction.user.id) {
        interaction.reply("Tsk, tsk! You cannot /good yourself. 👼");
      } else {
        const goodRef = doc(db, interaction.guildId, "counters", "good", user.id);
        const goodSnap = await getDoc(goodRef);
        const good = goodSnap.exists() ? goodSnap.data().count : 0;

        const badRef = doc(db, interaction.guildId, "counters", "bad", user.id);
        const badSnap = await getDoc(badRef);
        const bad = badSnap.exists() ? badSnap.data().count : 0;

        interaction.reply(`${user.username} has ${good - bad} karma points`);
      }
    } else {
      const karma = {};

      const goodRef = collection(db, interaction.guildId, "counters", "good");
      const goodSnap = await getDocs(goodRef);

      goodSnap.forEach((doc) => {
        karma[doc.id] = { user: doc.data().user, count: doc.data().count };
      });

      const badRef = collection(db, interaction.guildId, "counters", "bad");
      const badSnap = await getDocs(badRef);

      badSnap.forEach((doc) => {
        karma[doc.id] = {
          user: doc.data().user,
          count: karma[doc.id] ?? 0 - doc.data().count,
        };
      });

      if (Object.keys(karma).length === 0) {
        interaction.reply("No karma have been collected so far");
      } else {
        const list = Object.keys(karma).reduce(
          (acc, curr) => [...acc, { user: karma[curr].user, count: karma[curr].count }],
          []
        );
        const top = list
          .filter((t) => t.count > 0)
          .sort((a, b) => a.count - b.count)
          .slice(0, 3);
        const bottom = list
          .filter((t) => t.count <= 0)
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

        const output = [];

        if (top.length > 0) {
          output.push("Top " + Math.min(top.length, 3));
          top.forEach((u, i) => {
            output.push(`${i + 1}. ${u.user} has ${u.count} karma points`);
          });
        }
        if (top.length > 0 && bottom.length > 0) output.push("");
        if (bottom.length > 0) {
          output.push("Bottom " + Math.min(bottom.length, 3));
          bottom.forEach((u, i) => {
            output.push(`${i + 1}. ${u.user} has ${u.count} karma points`);
          });
        }

        interaction.reply(output.join("\n"));
      }
    }
  },
};
