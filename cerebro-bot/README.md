# cerebro-bot

Bot de Telegram — la interfaz de "mi cerebro". Directo, creativo, y habla
como la propia voz del señor (ver `src/persona.js`). Piensa con Gemini
(Google), no con la API de Anthropic — se elige así porque no requiere
tarjeta ni cuenta nueva, solo una cuenta de Google.

## Poner en marcha

1. `cd cerebro-bot && npm install`
2. Copia `.env.example` a `.env` y pega el `BOT_TOKEN` que te dio @BotFather.
3. (Opcional pero recomendado) Pon tu `OWNER_CHAT_ID` en `.env` para que el
   bot solo te responda a ti. Se consigue hablándole a @userinfobot en
   Telegram.
4. Pon tu `GEMINI_API_KEY` en `.env` — se saca gratis en
   aistudio.google.com/apikey con cualquier cuenta de Google.
5. `npm start`

## Estructura

- `src/bot.js` — arranque del bot (polling).
- `src/handlers/message.js` — recibe cada mensaje de texto y pide una
  respuesta al cerebro.
- `src/persona.js` — la personalidad del cerebro (tono, roles, reglas) y la
  llamada a Gemini.
