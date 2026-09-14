/**
 * Motor de traducción: recibe texto libre (una pregunta puntual o la
 * transcripción completa de un tutorial de Photoshop/Illustrator) y
 * devuelve las coincidencias encontradas en la base de conocimiento.
 *
 * Funciona 100% local (sin red) usando coincidencia de alias. Cuando el
 * host (prototipo web o app de escritorio) tiene acceso a un modelo de IA,
 * debe usar `buildExpertPrompt()` para pedir un análisis completo del
 * tutorial, y mostrar los resultados de `translateText()` como respaldo
 * instantáneo mientras llega la respuesta del modelo.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./knowledge-base.js"));
  } else {
    root.AffinityEngine = factory(root.AffinityKB);
  }
})(typeof self !== "undefined" ? self : this, function (KB) {
  function normalize(str) {
    return String(str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .trim();
  }

  // Índice: cada alias normalizado -> entrada de la KB
  const INDEX = [];
  KB.forEach((entry) => {
    (entry.aliases || []).forEach((alias) => {
      INDEX.push({ alias: normalize(alias), entry });
    });
  });

  /**
   * Busca coincidencias para una consulta corta (ej: "smart object", "pathfinder").
   * Devuelve un array ordenado por relevancia (máx `limit`).
   */
  function search(query, limit) {
    limit = limit || 8;
    const q = normalize(query);
    if (!q) return [];

    const scored = [];
    const seen = new Set();

    INDEX.forEach(({ alias, entry }) => {
      if (seen.has(entry.id)) return;
      let score = 0;
      if (alias === q) score = 100;
      else if (alias.startsWith(q) || q.startsWith(alias)) score = 70;
      else if (alias.includes(q) || q.includes(alias)) score = 40;

      if (score > 0) {
        scored.push({ entry, score });
        seen.add(entry.id);
      }
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.entry);
  }

  /**
   * Analiza un bloque largo de texto (transcripción de tutorial) buscando
   * menciones de herramientas/conceptos conocidos en la KB, línea por línea.
   * Devuelve { matches: [{line, entries}], unmatchedLines: [...] }
   */
  function translateText(text) {
    const raw = String(text || "");

    // Si el texto ya viene en varias líneas (lista de pasos pegada), respeta
    // esa segmentación. Si es un bloque continuo (transcripción sin saltos de
    // línea), lo separa por límites de oración.
    let lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length <= 1) {
      lines = raw
        .split(/(?<=[.!?])\s+/)
        .map((l) => l.trim())
        .filter(Boolean);
    }

    // Quita numeración/viñetas iniciales ("1.", "2)", "-", "•") para que no
    // queden como fragmentos sueltos sin coincidencia.
    lines = lines
      .map((l) => l.replace(/^\s*(?:\d+[.)]|[-*•])\s*/, "").trim())
      .filter(Boolean);

    const matches = [];
    const unmatchedLines = [];

    lines.forEach((line) => {
      const normLine = normalize(line);
      const hits = [];
      const seen = new Set();

      INDEX.forEach(({ alias, entry }) => {
        if (seen.has(entry.id)) return;
        if (alias.length >= 3 && normLine.includes(alias)) {
          hits.push(entry);
          seen.add(entry.id);
        }
      });

      if (hits.length > 0) {
        matches.push({ line, entries: hits });
      } else {
        unmatchedLines.push(line);
      }
    });

    return { matches, unmatchedLines };
  }

  /**
   * Construye el prompt experto para pedirle a un modelo de IA (Claude) que
   * traduzca el tutorial completo, dándole como contexto las coincidencias
   * locales ya encontradas para que no tenga que adivinar terminología.
   */
  function buildExpertPrompt(tutorialText, localMatches) {
    const kbContext = (localMatches && localMatches.matches ? localMatches.matches : [])
      .flatMap((m) => m.entries)
      .filter((e, i, arr) => arr.findIndex((x) => x.id === e.id) === i)
      .map(
        (e) =>
          `- ${e.category} · "${(e.aliases && e.aliases[0]) || e.id}" (${e.source_app}) -> ${e.equivalent} [${e.affinity_app}] (confianza: ${e.confidence})`
      )
      .join("\n");

    return [
      "Eres un experto senior en diseño gráfico, composición visual, retoque fotográfico e ilustración vectorial,",
      "con dominio profundo de Adobe Photoshop, Adobe Illustrator y toda la suite Affinity (Photo, Designer, Publisher).",
      "",
      "Tarea: el usuario te da la transcripción o los pasos de un tutorial hecho en Photoshop o Illustrator.",
      "Debes reescribirlo como una guía paso a paso equivalente para lograrlo en Affinity, manteniendo el mismo",
      "resultado creativo/de composición final. No traduzcas literalmente los nombres de menú si no existen en Affinity:",
      "encuentra el camino real dentro de Affinity para lograr el mismo efecto.",
      "",
      "Reglas:",
      "1. Numera los pasos igual que el tutorial original, indicando Persona/panel/herramienta exacta de Affinity.",
      "2. Si una función no tiene equivalente directo en Affinity, dilo explícitamente y da la mejor alternativa o workaround.",
      "3. Si no estás seguro de la ubicación exacta en la versión actual de Affinity, dilo ('verificar en tu versión') en vez de inventar.",
      "4. Cierra con un resumen breve de las diferencias conceptuales más importantes entre el flujo Adobe y el flujo Affinity para este caso.",
      "5. Responde en español, tono directo y profesional de mentor experto.",
      "",
      kbContext ? "Coincidencias ya detectadas localmente (úsalas como base, verifícalas y amplíalas):\n" + kbContext : "",
      "",
      "Transcripción / pasos del tutorial a traducir:",
      "\"\"\"",
      tutorialText,
      "\"\"\"",
    ]
      .filter(Boolean)
      .join("\n");
  }

  return { search, translateText, buildExpertPrompt, normalize };
});
