// La personalidad del cerebro. Placeholder a la espera de instrucciones
// del dueño sobre cómo debe comportarse (tono, roles, reglas).
export const persona = {
  ownerTitle: "señor",
  welcomeMessage:
    "Aquí estoy, señor. Todavía no tengo personalidad definida — dígame cómo quiere que me comporte y lo configuro.",
};

// Punto de extensión: aquí se conectará la lógica real de respuesta
// (reglas propias, o una llamada a un modelo de IA) una vez definida
// la personalidad del cerebro.
export async function respond(_text, _ctx) {
  return persona.welcomeMessage;
}
