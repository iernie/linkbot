import nodeGeocoder from "node-geocoder";
import { isAfter } from "date-fns";
import { SlashCommandBuilder } from "discord.js";

const geocoder = nodeGeocoder({ provider: "openstreetmap" });

export default {
  data: new SlashCommandBuilder()
    .setName("air")
    .setDescription("Provides air quality")
    .addStringOption((option) =>
      option.setName("location").setDescription("location for air quality").setRequired(true)
    ),
  async execute(interaction) {
    const location = await geocoder.geocode(interaction.options.getString("location").trim());
    if (location && location.length > 0) {
      const data = await fetch(
        `https://api.met.no/weatherapi/airqualityforecast/0.1/?lat=${location[0].latitude}&lon=${location[0].longitude}&filter_vars=AQI`,
        {
          headers: { "User-Agent": "linkbot" },
        }
      ).then((res) => res.json());

      if (data && data.data && data.data.time && data.data.time.length > 0) {
        const description = await fetch(`https://api.met.no/weatherapi/airqualityforecast/0.1/aqi_description`, {
          headers: { "User-Agent": "linkbot" },
        }).then((res) => res.json());

        const level = data.data.time.find((d) => isAfter(new Date(), d.from)).variables.AQI.value;
        const city =
          location[0].city !== undefined ? location[0].city : interaction.options.getString("location").trim();

        const desc = description.variables.AQI.aqis.find((d) => level >= (d.from ?? d.to) && level <= (d.to ?? d.from));

        interaction.reply(`${city}: ${desc.description_EN} (${desc.short_description_EN})`);
      } else {
        interaction.reply("Air quality not found 🤷");
      }
    } else {
      interaction.reply("Location not found 🤷");
    }
  },
};
