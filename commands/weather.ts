import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types.d.ts";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("temp")
    .setDescription("Provides temperature")
    .addStringOption((option) =>
      option.setName("location").setDescription("location for temperature").setRequired(true),
    ),
  async execute(interaction) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?addressdetails=1&q=${interaction.options.getString("location")!.trim().replace(" ", "+")}&format=json`,
    );
    const location = (await response.json()) as [
      {
        lat: string;
        lon: string;
        city: string;
      },
    ];

    const data = (await fetch(
      `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${location[0].lat}&lon=${location[0].lon}`,
      {
        headers: { "User-Agent": "linkbot" },
      },
    ).then((res) => res.json())) as {
      properties: { timeseries: Array<{ data: { instant: { details: { air_temperature: number } } } }> };
    };

    if (data && data.properties && data.properties.timeseries && data.properties.timeseries.length > 0) {
      const city =
        location[0].city !== undefined ? location[0].city : interaction.options.getString("location")!.trim();
      await interaction.reply(`${city}: ${data.properties.timeseries[0].data.instant.details.air_temperature}°C`);
    } else {
      await interaction.reply("🤷");
    }
  },
};

export default command;
