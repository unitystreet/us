const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("afina", {
  getSettings: () => ipcRenderer.invoke("get-settings"),
  saveSettings: (settings) => ipcRenderer.invoke("save-settings", settings),
  pickAudioFile: () => ipcRenderer.invoke("pick-audio-file"),
  analyzeTutorial: (prompt) => ipcRenderer.invoke("analyze-tutorial", prompt),
  transcribeAudio: (filePath) => ipcRenderer.invoke("transcribe-audio", filePath),
  minimizeWindow: () => ipcRenderer.send("minimize-window"),
  closeWindow: () => ipcRenderer.send("close-window"),
});
