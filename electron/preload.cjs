const { contextBridge, ipcRenderer } = require("electron");

// Única ponte entre a página e o processo principal: o renderer avisa quando
// as imagens da primeira tela já estão decodificadas, e só então a janela
// aparece. Ver `show: false` em electron/main.cjs e `warmupAssets` em
// src/utils/preloadAssets.js.
contextBridge.exposeInMainWorld("kiosk", {
  ready: () => ipcRenderer.send("kiosk:ready")
});
