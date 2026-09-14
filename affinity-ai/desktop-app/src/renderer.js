function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

const CONFIDENCE_LABEL = {
  estable: "Equivalencia directa",
  similar: "Similar",
  workaround: "Workaround",
  verificar: "Verificar versión",
};

function entryCard(e) {
  const shortcut = e.shortcut && e.shortcut !== "N/A"
    ? `<p class="card-shortcut">Atajo: <span class="mono">${escapeHtml(e.shortcut)}</span></p>` : "";
  return `<article class="card">
    <div class="card-top">
      <span class="badge ${e.confidence}">${CONFIDENCE_LABEL[e.confidence] || e.confidence}</span>
      <span class="card-app">${escapeHtml(e.source_app)} → ${escapeHtml(e.affinity_app)}</span>
    </div>
    <h3 class="card-title">${escapeHtml((e.aliases && e.aliases[0]) || e.id)}</h3>
    <p class="card-equiv"><strong>Equivalente:</strong> ${escapeHtml(e.equivalent)}</p>
    <p class="card-loc"><span class="mono">${escapeHtml(e.location)}</span></p>
    ${shortcut}
    <p class="card-notes">${escapeHtml(e.notes)}</p>
  </article>`;
}

// ---- Tabs ----
const tabs = {
  quick: { btn: document.getElementById("tabQuickBtn"), panel: document.getElementById("panelQuick") },
  tutorial: { btn: document.getElementById("tabTutorialBtn"), panel: document.getElementById("panelTutorial") },
  settings: { btn: document.getElementById("tabSettingsBtn"), panel: document.getElementById("panelSettings") },
};
function setTab(name) {
  Object.entries(tabs).forEach(([key, t]) => {
    const active = key === name;
    t.panel.hidden = !active;
    t.btn.classList.toggle("active", active);
  });
}
tabs.quick.btn.addEventListener("click", () => setTab("quick"));
tabs.tutorial.btn.addEventListener("click", () => setTab("tutorial"));
tabs.settings.btn.addEventListener("click", () => setTab("settings"));

// ---- Traductor rápido ----
const quickQuery = document.getElementById("quickQuery");
const quickResults = document.getElementById("quickResults");
function renderQuick() {
  const results = AffinityEngine.search(quickQuery.value, 6);
  quickResults.innerHTML = results.length
    ? results.map(entryCard).join("")
    : `<p class="empty-state">Sin coincidencias locales. Prueba: pathfinder, liquify, symbols, blend tool...</p>`;
}
quickQuery.addEventListener("input", renderQuick);
renderQuick();

// ---- Analizar tutorial ----
const tutorialInput = document.getElementById("tutorialInput");
const localPreview = document.getElementById("localPreview");
const expertReport = document.getElementById("expertReport");
const analyzeBtn = document.getElementById("analyzeBtn");
const analyzeStatus = document.getElementById("analyzeStatus");

function renderLocalPreview(result) {
  const lines = result.matches.map((m) => `
    <div class="preview-line">
      <p class="preview-line-text">${escapeHtml(m.line)}</p>
      <div class="chip-row">
        ${m.entries.map((e) => `<span class="chip badge ${e.confidence}">${escapeHtml(e.equivalent)}</span>`).join("")}
      </div>
    </div>`).join("");
  const unmatched = result.unmatchedLines.length
    ? `<p class="unmatched-note">${result.unmatchedLines.length} paso(s) sin coincidencia local — el análisis experto de IA los cubre.</p>`
    : "";
  localPreview.innerHTML = (lines || `<p class="empty-state">Sin coincidencias locales todavía.</p>`) + unmatched;
}
renderLocalPreview(AffinityEngine.translateText(tutorialInput.value));
tutorialInput.addEventListener("input", () => renderLocalPreview(AffinityEngine.translateText(tutorialInput.value)));

analyzeBtn.addEventListener("click", async () => {
  const text = tutorialInput.value.trim();
  if (!text) return;

  const local = AffinityEngine.translateText(text);
  renderLocalPreview(local);

  expertReport.hidden = false;
  expertReport.textContent = "Consultando al experto IA…";
  analyzeBtn.disabled = true;
  analyzeStatus.textContent = "";

  try {
    const prompt = AffinityEngine.buildExpertPrompt(text, local);
    const res = await window.afina.analyzeTutorial(prompt);
    expertReport.textContent = res.text;
  } catch (err) {
    expertReport.textContent = "No se pudo completar el análisis: " + (err && err.message ? err.message : "error desconocido");
  } finally {
    analyzeBtn.disabled = false;
  }
});

// ---- Transcripción de audio/video ----
const pickAudioBtn = document.getElementById("pickAudioBtn");
const transcribeStatus = document.getElementById("transcribeStatus");
pickAudioBtn.addEventListener("click", async () => {
  const filePath = await window.afina.pickAudioFile();
  if (!filePath) return;
  transcribeStatus.textContent = "Transcribiendo…";
  pickAudioBtn.disabled = true;
  try {
    const res = await window.afina.transcribeAudio(filePath);
    tutorialInput.value = res.text || "";
    renderLocalPreview(AffinityEngine.translateText(tutorialInput.value));
    transcribeStatus.textContent = "Listo. Revisa el texto y pulsa 'Traducir con IA experta'.";
  } catch (err) {
    transcribeStatus.textContent = "Error: " + (err && err.message ? err.message : "no se pudo transcribir");
  } finally {
    pickAudioBtn.disabled = false;
  }
});

// ---- Ajustes ----
const anthropicKeyInput = document.getElementById("anthropicKey");
const openaiKeyInput = document.getElementById("openaiKey");
const modelInput = document.getElementById("model");
const alwaysOnTopInput = document.getElementById("alwaysOnTop");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const settingsStatus = document.getElementById("settingsStatus");

async function loadSettingsIntoForm() {
  const s = await window.afina.getSettings();
  anthropicKeyInput.placeholder = s.hasAnthropicKey ? "•••••••••••• (configurada)" : "sk-ant-...";
  openaiKeyInput.placeholder = s.hasOpenaiKey ? "•••••••••••• (configurada)" : "sk-...";
  modelInput.value = s.model || "claude-sonnet-5";
  alwaysOnTopInput.checked = !!s.alwaysOnTop;
}
loadSettingsIntoForm();

saveSettingsBtn.addEventListener("click", async () => {
  const partial = {
    model: modelInput.value.trim() || "claude-sonnet-5",
    alwaysOnTop: alwaysOnTopInput.checked,
  };
  if (anthropicKeyInput.value.trim()) partial.anthropicKey = anthropicKeyInput.value.trim();
  if (openaiKeyInput.value.trim()) partial.openaiKey = openaiKeyInput.value.trim();

  await window.afina.saveSettings(partial);
  anthropicKeyInput.value = "";
  openaiKeyInput.value = "";
  settingsStatus.textContent = "Guardado.";
  await loadSettingsIntoForm();
  setTimeout(() => { settingsStatus.textContent = ""; }, 2000);
});

// ---- Chrome de ventana ----
document.getElementById("minBtn").addEventListener("click", () => window.afina.minimizeWindow());
document.getElementById("closeBtn").addEventListener("click", () => window.afina.closeWindow());
