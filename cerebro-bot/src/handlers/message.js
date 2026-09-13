import { respond } from "../persona.js";

export async function handleMessage(ctx) {
  const text = ctx.message?.text ?? "";
  const reply = await respond(text, ctx);
  await ctx.reply(reply);
}
