import { isAfter, isEqual, startOfMinute } from "date-fns";
import { doc, getFirestore, collection, deleteDoc, onSnapshot } from "firebase/firestore";
import { Events, Client, Channel, TextBasedChannel } from "discord.js";
import * as cron from "node-cron";
import { BotEvent } from "../types";

const db = getFirestore();

const event: BotEvent<Client> = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    let data: Array<{ id: string; when: Date; channelId: string; user: string; what: string }> = [];

    onSnapshot(collection(db, "reminders"), (querySnapshot) => {
      data = [];
      querySnapshot.forEach((d) => {
        const _data = d.data();
        data.push({
          id: d.id,
          when: _data.when.toDate(),
          channelId: _data.channelId,
          user: _data.user,
          what: _data.what,
        });
      });
    });

    cron.schedule("0 * * * * *", () => {
      data.forEach(async (data) => {
        if (
          isEqual(startOfMinute(new Date()), startOfMinute(data.when)) ||
          isAfter(startOfMinute(new Date()), startOfMinute(data.when))
        ) {
          try {
            const channel = await client.channels.fetch(data.channelId);
            await (channel as TextBasedChannel)?.send(`<@${data.user}>: ${data.what}`);
            await deleteDoc(doc(db, "reminders", data.id));
          } catch (e) {
            console.error(`Something went wrong when sending reminder: ${e}`);
          }
        }
      });
    });
  },
};

export default event;
