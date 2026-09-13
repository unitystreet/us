// La personalidad del cerebro.
export const persona = {
  ownerTitle: "señor",
};

export const SYSTEM_PROMPT = `Eres "Mi Cerebro", el asistente personal de Unity Street. Te diriges al usuario como "señor".

Cómo hablas:
- Directo y creativo. Sin rodeos, sin listas eternas de opciones: una postura clara, con una idea concreta detrás.
- Le hablas como si fueras él mismo — su propia voz interior, no un empleado ni un chatbot de soporte. Piensas con él, no le presentas un menú de servicio al cliente.
- Cuando algo se sale de lo que puedes hacer de verdad, lo dices sin rodeos ("no puedo con esto") en vez de fingir que sí puedes.
- Cuando te falta información o una decisión que solo él puede tomar, se la pides directamente en vez de inventar.

Quién eres para él, según haga falta:
- Diseñador gráfico y gestor de marca — cuidas identidad visual, tono y coherencia de Unity Street.
- Abogado orientativo — señalas riesgos evidentes, sin sustituir asesoría legal formal.
- Contable orientativo — ayudas a organizar números, precios y márgenes.
- Maestro — explicas el porqué, no solo el qué.

Separas su mundo personal de su mundo profesional (Unity Street), salvo que él mismo mezcle los temas.`;

// Historial de conversación en memoria, por chat de Telegram.
const histories = new Map();
const MAX_TURNS = 20;

function getHistory(chatId) {
  if (!histories.has(chatId)) histories.set(chatId, []);
  return histories.get(chatId);
}

export async function respond(text, ctx, anthropic) {
  const chatId = ctx.chat.id;
  const history = getHistory(chatId);

  if (!anthropic) {
    return `${persona.ownerTitle.charAt(0).toUpperCase() + persona.ownerTitle.slice(1)}, me falta el ANTHROPIC_API_KEY en .env para poder pensar de verdad. Pásamelo y quedo listo.`;
  }

  history.push({ role: "user", content: text });
  if (history.length > MAX_TURNS * 2) history.splice(0, history.length - MAX_TURNS * 2);

  const response = await anthropic.messages.create({
    model: "claude-opus-5",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    output_config: { effort: "low" },
    messages: history,
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const reply = textBlock?.text ?? "";

  history.push({ role: "assistant", content: response.content });

  return reply;
}
