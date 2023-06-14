import { getHours, getMinutes, isToday } from "date-fns";
import { doc, updateDoc, getDoc, setDoc, getFirestore, increment } from "firebase/firestore";
import { Events } from "discord.js";

const db = getFirestore();

export default {
  name: Events.MessageCreate,
  async execute(message) {
    const time = new Date(message.createdTimestamp);
    if (
      !message.author.bot &&
      message.content.match(new RegExp("1337", "i")) &&
      getHours(time) === 13 &&
      getMinutes(time) === 37
    ) {
      const docRef = doc(db, message.guildId, "counters", "1337", message.author.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const result = docSnap.data();

        if (!isToday(result.lastModified.toDate())) {
          await updateDoc(docRef, {
            user: message.author.username,
            streak: increment(1),
            lastModified: new Date(),
          });
          message.react("💯");
        }
      } else {
        await setDoc(docRef, {
          user: message.author.username,
          streak: 1,
          lastModified: new Date(),
          createdAt: new Date(),
        });
        message.react("💯");
      }
    }
  },
};
