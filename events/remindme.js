import { isAfter, isEqual } from "date-fns";
import { doc, getFirestore, collection, deleteDoc, onSnapshot } from "firebase/firestore";
import { Events } from "discord.js";
import * as cron from "node-cron";

const db = getFirestore();

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    let data = [];

    onSnapshot(collection(db, "reminders"), (querySnapshot) => {
      data = [];
      querySnapshot.foreach((d) => {
        data.push({
          id: d.id,
          ...d.data(),
        });
      });
    });

    cron.schedule("* * * * *", () => {
      data.forEach(async (data) => {
        if (isEqual(data.when.toDate(), new Date()) || isAfter(data.when.toDate(), new Date())) {
          try {
            const channel = await client.channels.fetch(data.channelId);
            channel.send(`<@${data.user}>: ${data.what}`);
            await deleteDoc(doc(db, "reminders", data.id));
          } catch (e) {
            console.error(`Something went wrong when sending reminder: ${e}`);
          }
        }
      });
    });
  },
};
