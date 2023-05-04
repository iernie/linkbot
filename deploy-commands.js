import * as dotenv from "dotenv";
dotenv.config();

import { readdirSync } from "node:fs";
import { REST, Routes } from "discord.js";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

(async () => {
  const app = initializeApp({
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
  });

  const auth = getAuth(app);
  signInWithEmailAndPassword(auth, process.env.email, process.env.password)
    .then(() => {
      console.log("Logged into firebase");
    })
    .catch((error) => {
      console.log(error);
    });

  const commands = [];

  const commandFiles = readdirSync("./commands");
  for (const file of commandFiles) {
    const filePath = "./commands/" + file;
    const command = (await import(filePath)).default;
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }

  const rest = new REST().setToken(process.env.token);

  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(Routes.applicationCommands(process.env.clientId), { body: commands });

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
