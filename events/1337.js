import { differenceInDays, getHours, getMinutes } from 'date-fns';
import { doc, updateDoc, getDoc, setDoc, getFirestore } from "firebase/firestore";
import { Events } from 'discord.js';

const db = getFirestore();

export default {
  name: Events.MessageCreate,
	once: false,
	async execute(message) {
    const time = new Date(message.createdTimestamp);
    if (message.content.match(new RegExp("1337", "i")) && getHours(time) === 13 && getMinutes(time) === 37) {
      const docRef = doc(db, message.guildId, message.author.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const result = docSnap.data();
        if (differenceInDays(time, result.leetUpdated) <= 1) {
          await updateDoc(docRef, {
            leetStreak: result.leetStreak + 1,
            leetUpdated: new Date()
          })
        } else {
          await updateDoc(docRef, {
            leetStreak: 1,
            leetUpdated: new Date()
          })
        }
      } else {
        await setDoc(docRef, {
          leetStreak: 1,
          leetUpdated: new Date(),
          createdAt: new Date()
        })
          .then(() => {
            console.log('Document successfully written!');
          })
          .catch((error) => {
            console.error('Error writing document: ', error);
          });
      }
    }
	}
};
