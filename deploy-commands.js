import * as dotenv from 'dotenv';
dotenv.config()

import { readdirSync } from 'node:fs';
import { REST, Routes } from 'discord.js';

const commands = [];

const commandFiles = readdirSync("./commands");
for (const file of commandFiles) {
	const filePath = "./commands/" + file;
	const command = (await import(filePath)).default;
	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

const rest = new REST().setToken(process.env.token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(process.env.clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();