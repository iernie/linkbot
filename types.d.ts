import type { Collection, ChatInputCommandInteraction, SlashCommandOptionsOnlyBuilder } from "discord.js";

export interface SlashCommand {
  data: SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface BotEvent<T> {
  name: string;
  once?: boolean;
  execute: (arg: T) => Promise<void>;
}

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, SlashCommand>;
  }
}
