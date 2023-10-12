import * as dotenv from "dotenv";
dotenv.config();

import path from "node:path";
import { readdirSync } from "node:fs";
import { Client, Collection, GatewayIntentBits } from "discord.js";

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import type { BotEvent, SlashCommand } from "./types.d.ts";

import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

(async () => {
  const app = initializeApp({
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
  });

  const auth = getAuth(app);
  signInWithEmailAndPassword(auth, process.env.email!, process.env.password!)
    .then(() => {
      console.log("Logged into firebase");
    })
    .catch((error) => {
      console.log(error);
    });

  const client = new Client({
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
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
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
