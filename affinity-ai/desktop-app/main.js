const { app, BrowserWindow, ipcMain, globalShortcut, dialog, Menu } = require("electron");
const path = require("path");
const fs = require("fs");

const DEFAULT_SETTINGS = {
  anthropicKey: "",
  openaiKey: "",
  model: "claude-sonnet-5",
  alwaysOnTop: true,
};

function configPath() {
  return path.join(app.getPath("userData"), "afina-config.json");
}

function loadSettings() {
  try {
    const raw = fs.readFileSync(configPath(), "utf8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings) {
  fs.writeFileSync(configPath(), JSON.stringify(settings, null, 2), "utf8");
}

let win = null;

function createWindow() {
  const settings = loadSettings();

  win = new BrowserWindow({
    width: 400,
    height: 640,
    minWidth: 340,
    minHeight: 420,
    frame: false,
    resizable: true,
    show: false,
    backgroundColor: "#0e1116",
    alwaysOnTop: !!settings.alwaysOnTop,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (settings.alwaysOnTop) {
    // 'floating' mantiene la ventana sobre apps normales; en macOS puedes
    // subir a 'screen-saver' si necesitas estar por encima de apps a pantalla completa.
    win.setAlwaysOnTop(true, "floating");
  }

  win.loadFile(path.join(__dirname, "src", "index.html"));
  win.once("ready-to-show", () => win.show());

  // Cerrar el panel solo lo oculta: el objetivo es que "Afina" siga flotando
  // disponible vía el atajo global, como un copiloto persistente.
  win.on("close", (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      win.hide();
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register("CommandOrControl+Alt+A", () => {
    if (!win) return;
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
      win.focus();
    }
  });

  const menu = Menu.buildFromTemplate([
    {
      label: "Afina",
      submenu: [
        {
          label: "Mostrar / Ocultar",
          accelerator: "CommandOrControl+Alt+A",
          click: () => {
            if (!win) return;
            win.isVisible() ? win.hide() : win.show();
          },
        },
        { type: "separator" },
        {
          label: "Salir",
          click: () => {
            app.isQuitting = true;
            app.quit();
          },
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

// ---------------- IPC: ajustes ----------------

ipcMain.handle("get-settings", () => {
  const s = loadSettings();
  // Nunca se devuelven las claves en texto plano al renderer, solo si están configuradas.
  return {
    hasAnthropicKey: !!s.anthropicKey,
    hasOpenaiKey: !!s.openaiKey,
    model: s.model,
    alwaysOnTop: s.alwaysOnTop,
  };
});

ipcMain.handle("save-settings", (event, partial) => {
  const current = loadSettings();
  const next = { ...current, ...partial };
  saveSettings(next);
  if (typeof partial.alwaysOnTop === "boolean" && win) {
    win.setAlwaysOnTop(partial.alwaysOnTop, "floating");
  }
  return { ok: true };
});

// ---------------- IPC: selección de archivo ----------------

ipcMain.handle("pick-audio-file", async () => {
  const result = await dialog.showOpenDialog(win, {
    properties: ["openFile"],
    filters: [
      { name: "Audio / Video", extensions: ["mp3", "mp4", "m4a", "wav", "webm", "mpeg", "mpga", "mov"] },
    ],
  });
  if (result.canceled || !result.filePaths.length) return null;
  return result.filePaths[0];
});

// ---------------- IPC: análisis experto (Claude) ----------------

ipcMain.handle("analyze-tutorial", async (event, prompt) => {
  const settings = loadSettings();
  if (!settings.anthropicKey) {
    throw new Error("Falta tu clave de API de Anthropic. Configúrala en la pestaña Ajustes.");
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": settings.anthropicKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: settings.model || DEFAULT_SETTINGS.model,
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = (data.content || []).map((c) => c.text || "").join("\n");
  return { text };
});

// ---------------- IPC: transcripción (Whisper / OpenAI) ----------------

ipcMain.handle("transcribe-audio", async (event, filePath) => {
  const settings = loadSettings();
  if (!settings.openaiKey) {
    throw new Error("Falta tu clave de API de OpenAI (Whisper). Configúrala en la pestaña Ajustes.");
  }

  const fileBuffer = fs.readFileSync(filePath);
  const form = new FormData();
  form.append("file", new Blob([fileBuffer]), path.basename(filePath));
  form.append("model", "whisper-1");
  form.append("language", "es");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${settings.openaiKey}` },
    body: form,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  return { text: data.text || "" };
});

// ---------------- IPC: chrome de ventana ----------------

ipcMain.on("minimize-window", () => { if (win) win.hide(); });
ipcMain.on("close-window", () => { if (win) win.hide(); });
