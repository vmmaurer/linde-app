import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // base relativo: o index.html gerado passa a apontar para "./assets/..."
  // em vez de "/assets/...". Continua funcionando igual servido por HTTP e
  // é o que permite abrir o build direto por file:// dentro do Electron.
  // OBS: os caminhos de /images e /font são strings absolutas no código e
  // vêm de public/, então NÃO são reescritos por aqui — ver README/relatório.
  base: './',

  build: {
    // O totem roda Chromium recente (e o Electron também). Compilar para um
    // alvo moderno evita polyfills/transpilação desnecessária no bundle.
    target: 'chrome110',
    // Sem sourcemap em produção: build menor e sem exposição do código-fonte.
    sourcemap: false,
  },
})
