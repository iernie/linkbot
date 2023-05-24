import { differenceInMilliseconds } from "date-fns";
import { getDocs, getFirestore, collection } from "firebase/firestore";
import { Events } from "discord.js";

const db = getFirestore();

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    const querySnapshot = await getDocs(collection(db, "reminders"));
    querySnapshot.forEach(async (doc) => {
      const data = doc.data();

      try {
        const channel = await client.channels.fetch(data.channelId);

        setTimeout(() => {
          channel.send(`<@${data.user}>: ${data.what}`);
        }, differenceInMilliseconds(data.when.toDate(), client.readyAt));
      } catch (e) {
        console.error(`Something went wrong when creating reminders: ${e}`);
      }
    });
  },
};
