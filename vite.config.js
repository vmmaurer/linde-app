import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // base relativo: o index.html gerado aponta para "./assets/..." em vez de
  // "/assets/...". Continua funcionando servido por HTTP e é o que permite
  // abrir o build direto de um wrapper nativo (Capacitor/WebView), que
  // carrega os arquivos por caminho local.
  base: './',

  server: {
    // Para abrir no celular pelo IP da máquina durante o desenvolvimento.
    host: true,
  },

  build: {
    target: 'chrome110',
    sourcemap: false,
  },
})
