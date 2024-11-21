import * as dotenv from "dotenv";
dotenv.config();

import path from "node:path";
import { readdirSync } from "node:fs";
import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import type { BotEvent, SlashCommand } from "./types.d.ts";

(async () => {
  const app = initializeApp({
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
  });
  getFirestore(app);

  try {
    await signInWithEmailAndPassword(getAuth(app), process.env.email!, process.env.password!);
    console.log("Logged into firebase");
  } catch (error) {
    console.error(error);
  }

  const client = new Client({
    partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.ThreadMember],
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions,
    ],
  });
  client.commands = new Collection<string, SlashCommand>();

  const commandFiles = readdirSync("./commands");
  for (const file of commandFiles.filter((el) => path.extname(el) === ".js")) {
    const filePath = "./commands/" + file;
    const command = (await import(filePath)).default as SlashCommand;
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.error(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }

  const eventFiles = readdirSync("./events");
  for (const file of eventFiles.filter((el) => path.extname(el) === ".js")) {
    const filePath = "./events/" + file;
    const event = (await import(filePath)).default as BotEvent<unknown>;
    if (event.once) {
      client.once(event.name, (arg) => event.execute(arg));
    } else {
      client.on(event.name, (arg) => event.execute(arg));
    }
  }

  client.login(process.env.token!);
})();
