import Anthropic from "@anthropic-ai/sdk";
import { respond } from "../persona.js";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export async function handleMessage(ctx) {
  const text = ctx.message?.text ?? "";
  await ctx.sendChatAction("typing");
  try {
    const reply = await respond(text, ctx, anthropic);
    await ctx.reply(reply);
  } catch (err) {
    console.error("Error al pensar la respuesta:", err);
    await ctx.reply("Se me trabó algo por dentro. Revisa los logs, señor.");
  }
}
