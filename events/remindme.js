import { isAfter, differenceInMilliseconds } from "date-fns";
import { getDocs, getFirestore, collection, deleteDoc } from "firebase/firestore";
import { Events } from "discord.js";

const db = getFirestore();

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    const querySnapshot = await getDocs(collection(db, "reminders"));
    querySnapshot.forEach(async (doc) => {
      const data = doc.data();

      if (isAfter(data.when.toDate(), client.readyAt)) {
        await deleteDoc(doc);
      } else {
        try {
          const channel = await client.channels.fetch(data.channelId);

          setTimeout(async () => {
            channel.send(`<@${data.user}>: ${data.what}`);
            await deleteDoc(doc);
          }, differenceInMilliseconds(data.when.toDate(), client.readyAt));
        } catch (e) {
          console.error(`Something went wrong when creating reminders: ${e}`);
        }
      }
    });
  },
};
