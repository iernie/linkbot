import { isAfter, differenceInMilliseconds } from "date-fns";
import { doc, getDocs, getFirestore, collection, deleteDoc } from "firebase/firestore";
import { Events } from "discord.js";

const db = getFirestore();

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    const querySnapshot = await getDocs(collection(db, "reminders"));
    querySnapshot.forEach(async (document) => {
      const data = document.data();

      if (!data.when || isAfter(data.when.toDate(), client.readyAt)) {
        await deleteDoc(doc(db, "reminders", document.id));
      } else {
        try {
          const channel = await client.channels.fetch(data.channelId);

          setTimeout(async () => {
            channel.send(`<@${data.user}>: ${data.what}`);
            await deleteDoc(doc(db, "reminders", document.id));
          }, differenceInMilliseconds(data.when.toDate(), client.readyAt));
        } catch (e) {
          console.error(`Something went wrong when creating reminders: ${e}`);
        }
      }
    });
  },
};
