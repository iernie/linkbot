import { formatDistanceToNow } from "date-fns";
import normalizeUrl from "normalize-url";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { Events } from "discord.js";

const db = getFirestore();

const pattern = new RegExp(
  "(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?",
  "ig"
); // fragment locator

export default {
  name: Events.MessageCreate,
  once: false,
  execute(message) {
    const matches = message.content.match(pattern);
    if (matches) {
      matches
        .map((url) => new URL(normalizeUrl(url, { forceHttps: true, removeDirectoryIndex: true })))
        .forEach(async (url) => {
          const docRef = doc(db, message.guildId, message.channelId, "url", url.href.replace(/\//gi, ""));
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const result = docSnap.data();
            if (result.user !== message.author.id) {
              const days = formatDistanceToNow(result.createdAt.toDate(), { includeSeconds: true });
              await message.reply(`old! This was posted by <@${result.user}> ${days} ago.`);
            }
          } else {
            await setDoc(docRef, {
              url: url.href,
              user: message.author.id,
              channel: message.channelId,
              createdAt: new Date(),
            });
          }
        });
    }
  },
};
