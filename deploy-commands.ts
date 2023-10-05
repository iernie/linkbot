import * as dotenv from "dotenv";
dotenv.config();

import path from "node:path";
import { readdirSync } from "node:fs";
import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { initializeApp } from "firebase/app";
import type { SlashCommand } from "./types.d.ts";

(async () => {
  initializeApp({
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
  });

  const commands: Array<RESTPostAPIChatInputApplicationCommandsJSONBody> = [];

  const commandFiles = readdirSync("./commands");
  for (const file of commandFiles.filter((el) => path.extname(el) === ".ts")) {
    const filePath = "./commands/" + file;
    const command = (await import(filePath)).default as SlashCommand;
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }

  const rest = new REST().setToken(process.env.token!);

  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = (await rest.put(Routes.applicationCommands(process.env.clientId!), {
      body: commands,
    })) as Array<unknown>;

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
