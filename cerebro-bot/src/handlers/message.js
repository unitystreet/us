import { GoogleGenAI } from "@google/genai";
import { respond } from "../persona.js";

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

export async function handleMessage(ctx) {
  const text = ctx.message?.text ?? "";
  await ctx.sendChatAction("typing");
  try {
    const reply = await respond(text, ctx, ai);
    await ctx.reply(reply);
  } catch (err) {
    console.error("Error al pensar la respuesta:", err);
    await ctx.reply("Se me trabó algo por dentro. Revisa los logs, señor.");
  }
}
