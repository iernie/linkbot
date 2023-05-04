import nodeGeocoder from "node-geocoder";
import nb from "date-fns/locale/nb/index.js";
import { format } from "date-fns";
import { SlashCommandBuilder } from "discord.js";

const geocoder = nodeGeocoder({ provider: "openstreetmap" });

const Level = {
  UNKNOWN: 0,
  LOW: 1,
  MODERATE: 2,
  HIGH: 3,
  EXTREME: 4,
};

const threshold = (low, moderate, high) => {
  return (value) => {
    if (value < low) {
      return Level.LOW;
    }
    if (value >= low && value < moderate) {
      return Level.MODERATE;
    }
    if (value >= moderate && value <= high) {
      return Level.HIGH;
    }
    if (value > high) {
      return Level.EXTREME;
    }
    return Level.UNKNOWN;
  };
};

const pm10 = threshold(50, 80, 400);
const no2 = threshold(100, 200, 400);
const pm25 = threshold(25, 40, 150);
const so2 = threshold(100, 350, 500);
const o3 = threshold(100, 180, 240);

const getLevel = (parameter, value) => {
  switch (parameter) {
    case "pm10":
      return pm10(value);
    case "no2":
      return no2(value);
    case "pm25":
      return pm25(value);
    case "so2":
      return so2(value);
    case "o3":
      return o3(value);
    default:
      return Level.UNKNOWN;
  }
};

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
      const json = await fetch(
        `https://api.openaq.org/v1/measurements?radius=10000&coordinates=${location[0].latitude},${
          location[0].longitude
        }&date_from=${format(new Date(), "yyyy-LL-dd", { locale: nb })}`,
        { headers: { "User-Agent": "linkbot" } }
      ).then((res) => res.json());
      if (json && json.results && json.results.length > 0) {
        const level = Math.max(...json.results.map((result) => getLevel(result.parameter, result.value)));
        const city =
          location[0].city !== undefined ? location[0].city : interaction.options.getString("location").trim();
        if (level === Level.LOW) interaction.reply(`${city}: Low to none health risk`);
        else if (level === Level.MODERATE) interaction.reply(`${city}: Moderate health risk`);
        else if (level === Level.HIGH) interaction.reply(`${city}: Substantial health risk`);
        else if (level === Level.EXTREME) interaction.reply(`${city}: Serious health risk`);
        else interaction.reply("Air quality not found 🤷");
      } else {
        interaction.reply("Location not found 🤷");
      }
    }
  },
};
