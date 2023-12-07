import { doc, getDoc, getDocs, collection, getFirestore } from "firebase/firestore";
import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types.d.ts";

const db = getFirestore();
type KarmaType = { user: string; count: number };

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("karma")
    .setDescription("Check all or someones karma")
    .addUserOption((option) => option.setName("user").setDescription("the user")),
  async execute(interaction) {
    const user = interaction.options.getUser("user");

    if (user) {
      const goodRef = doc(db, interaction.guildId!, "counters", "good", user.id);
      const goodSnap = await getDoc(goodRef);
      const good = goodSnap.exists() ? goodSnap.data().count : 0;

      const badRef = doc(db, interaction.guildId!, "counters", "bad", user.id);
      const badSnap = await getDoc(badRef);
      const bad = badSnap.exists() ? badSnap.data().count : 0;

      await interaction.reply(`${user.displayName} has ${good - bad} karma points`);
    } else {
      const karma: { [key: string]: KarmaType } = {};

      const goodRef = collection(db, interaction.guildId!, "counters", "good");
      const goodSnap = await getDocs(goodRef);

      goodSnap.forEach((doc) => {
        karma[doc.id] = { user: (doc.data() as KarmaType).user, count: (doc.data() as KarmaType).count };
      });

      const badRef = collection(db, interaction.guildId!, "counters", "bad");
      const badSnap = await getDocs(badRef);

      badSnap.forEach((doc) => {
        karma[doc.id] = {
          user: doc.data().user,
          count: karma[doc.id]?.count ?? 0 - (doc.data() as KarmaType).count,
        };
      });

      if (Object.keys(karma).length === 0) {
        await interaction.reply("No karma have been collected so far");
      } else {
        const list = Object.keys(karma).reduce(
          (acc, curr) => [...acc, { user: karma[curr].user, count: karma[curr].count }],
          [] as Array<KarmaType>,
        );
        const top = list
          .filter((t) => t.count > 0)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        const bottom = list
          .filter((t) => t.count <= 0)
          .sort((a, b) => a.count - b.count)
          .slice(0, 5)
          .reverse();

        const output = [];
        const paddingTop = top.length > 0 ? `${top[0].count}`.length + 4 : 5;
        const paddingBottom = bottom.length > 0 ? `${bottom[0].count}`.length + 4 : 5;
        const padding = Math.max(paddingTop, paddingBottom);

        output.push("Scoreboard");
        top.forEach((u) => {
          output.push(`${u.count}`.padEnd(padding, " ") + `${u.user}`);
        });
        if (top.length > 0 && bottom.length > 0) output.push("⋮");
        bottom.forEach((u) => {
          output.push(`${u.count}`.padEnd(padding, " ") + `${u.user}`);
        });

        await interaction.reply(output.join("\n"));
      }
    }
  },
};

export default command;
