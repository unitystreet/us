import "dotenv/config";
import { Telegraf } from "telegraf";
import { persona } from "./persona.js";
import { handleMessage } from "./handlers/message.js";

const { BOT_TOKEN, OWNER_CHAT_ID } = process.env;

if (!BOT_TOKEN) {
  console.error(
    "Falta BOT_TOKEN. Copia .env.example a .env y pega el token que te dio @BotFather."
  );
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Si se define OWNER_CHAT_ID, el bot solo responde a ese chat.
if (OWNER_CHAT_ID) {
  bot.use(async (ctx, next) => {
    if (String(ctx.chat?.id) !== String(OWNER_CHAT_ID)) return;
    return next();
  });
}

bot.start((ctx) => ctx.reply(`Hola, ${persona.ownerTitle}. ${persona.welcomeMessage}`));

bot.on("text", handleMessage);

bot.launch();
console.log("cerebro-bot corriendo (polling)...");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
