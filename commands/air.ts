import nodeGeocoder from "node-geocoder";
import { isAfter, parseISO } from "date-fns";
import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

const geocoder = nodeGeocoder({ provider: "openstreetmap" });

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("air")
    .setDescription("Provides air quality")
    .addStringOption((option) =>
      option.setName("location").setDescription("location for air quality").setRequired(true),
    ),
  async execute(interaction) {
    const location = await geocoder.geocode(interaction.options.getString("location")!.trim());
    if (location && location.length > 0) {
      const data = (await fetch(
        `https://api.met.no/weatherapi/airqualityforecast/0.1/?lat=${location[0].latitude}&lon=${location[0].longitude}&filter_vars=AQI`,
        {
          headers: { "User-Agent": "linkbot" },
        },
      ).then((res) => res.json())) as {
        data: { time: Array<{ from: string; to: string; variables: { AQI: { value: number; units: string } } }> };
      };

      if (data && data.data && data.data.time && data.data.time.length > 0) {
        const description = (await fetch(`https://api.met.no/weatherapi/airqualityforecast/0.1/aqi_description`, {
          headers: { "User-Agent": "linkbot" },
        }).then((res) => res.json())) as {
          variables: {
            AQI: {
              aqis: Array<
                | {
                    from?: undefined;
                    to: number;
                    class: number;
                    description_EN: string;
                    short_description_EN: string;
                  }
                | {
                    from: number;
                    to?: undefined;
                    class: number;
                    description_EN: string;
                    short_description_EN: string;
                  }
              >;
            };
          };
        };

        const level = data.data.time.find((d) => isAfter(new Date(), parseISO(d.from)))!.variables.AQI.value;
        const city =
          location[0].city !== undefined ? location[0].city : interaction.options.getString("location")!.trim();

        const desc = description.variables.AQI.aqis.find(
          (d) => level >= (d.from ?? d.to + 1) && level <= (d.to ?? d.from - 1),
        )!;

        await interaction.reply(`${city}: ${desc.description_EN} (${desc.short_description_EN})`);
      } else {
        await interaction.reply("Air quality not found 🤷");
      }
    } else {
      await interaction.reply("Location not found 🤷");
    }
  },
};

export default command;
