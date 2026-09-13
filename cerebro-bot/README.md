# cerebro-bot

Bot de Telegram — la interfaz de "mi cerebro". Todavía sin personalidad
definida; esto es el esqueleto funcional.

## Poner en marcha

1. `cd cerebro-bot && npm install`
2. Copia `.env.example` a `.env` y pega el `BOT_TOKEN` que te dio @BotFather.
3. (Opcional pero recomendado) Pon tu `OWNER_CHAT_ID` en `.env` para que el
   bot solo te responda a ti. Se consigue hablándole a @userinfobot en
   Telegram.
4. `npm start`

## Estructura

- `src/bot.js` — arranque del bot (polling).
- `src/handlers/message.js` — recibe cada mensaje de texto y pide una
  respuesta al cerebro.
- `src/persona.js` — punto de extensión: aquí se define cómo debe
  comportarse el cerebro (tono, roles, reglas). Pendiente de instrucciones.
