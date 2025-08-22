import * as dotenv from "dotenv";
dotenv.config();

// Require this first!
import * as Sentry from "@sentry/node";

// Ensure to call this before importing any other modules!
Sentry.init({
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.httpIntegration({
      trackIncomingRequestsAsSessions: false, // default: true
    }),
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
  enableLogs: true,
  sendDefaultPii: true,
});

import path from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync } from "node:fs";
import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import type { BotEvent, SlashCommand } from "./types.d.ts";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

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
    partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.ThreadMember, Partials.User],
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.DirectMessageReactions,
    ],
  });
  client.commands = new Collection<string, SlashCommand>();

  const commandPath = path.join(__dirname, "commands");
  const commandFiles = readdirSync(commandPath);
  for (const file of commandFiles.filter((el) => path.extname(el) === ".js")) {
    const filePath = "./commands/" + file;
    const command = (await import(filePath)).default as SlashCommand;
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.error(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }

  const eventsPath = path.join(__dirname, "events");
  const eventFiles = readdirSync(eventsPath);
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
