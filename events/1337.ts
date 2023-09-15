import { getHours, getMinutes, isToday } from "date-fns";
import { doc, updateDoc, getDoc, setDoc, getFirestore, increment, Timestamp } from "firebase/firestore";
import { Events, Message } from "discord.js";
import type { BotEvent } from "../types.d.ts";

const db = getFirestore();
type LeetType = {
  lastModified: Timestamp;
  user: string;
  streak: number;
};

const event: BotEvent<Message> = {
  name: Events.MessageCreate,
  async execute(message) {
    if (!message.member || message.member.user.bot) return;
    if (!message.guild) return;

    const time = new Date(message.createdTimestamp);
    if (!message.author.bot && message.content.match(new RegExp("^1337$", "i"))) {
      if (getHours(time) === 13 && getMinutes(time) === 37) {
        const docRef = doc(db, message.guildId!, "counters", "1337", message.author.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const result = docSnap.data() as LeetType;

          if (!isToday(result.lastModified.toDate())) {
            await updateDoc(docRef, {
              user: message.author.displayName,
              streak: increment(1),
              lastModified: new Date(),
            });
          }
        } else {
          await setDoc(docRef, {
            user: message.author.displayName,
            streak: 1,
            lastModified: new Date(),
            createdAt: new Date(),
          });
        }
      }
    }
  },
};

export default event;
