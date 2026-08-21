import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

const IMAGES_DIR = 'public/images'
const MANIFEST = 'images-manifest.json'

/**
 * Lista TODA imagem de public/images num JSON servido junto com o app.
 *
 * Sem isto, o aquecimento só conhece o que está escrito à mão em
 * src/utils/preloadAssets.js — e qualquer foto nova adicionada ao projeto
 * nasce fria, carregando na frente do visitante. Com o manifesto, "todas as
 * imagens" é literal: o preloader lê a pasta, não uma lista que envelhece.
 */
function imagesManifest() {
  const listar = () => {
    try {
      return fs
        .readdirSync(IMAGES_DIR)
        .filter((f) => /\.(webp|avif|png|jpe?g|gif)$/i.test(f))
        .sort()
        .map((f) => `./images/${f}`)
    } catch {
      return []
    }
  }

  return {
    name: 'linde-images-manifest',
    // Em `npm run dev` o manifesto não existe em disco: serve na hora.
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || req.url.split('?')[0] !== `/${MANIFEST}`) return next()
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify(listar()))
      })
    },
    // No build vai para dist/images-manifest.json (caminho fixo, sem hash:
    // o preloader precisa saber o nome sem consultar o bundle).
    writeBundle(options) {
      const lista = listar()
      fs.writeFileSync(path.join(options.dir, MANIFEST), JSON.stringify(lista))
      console.log(`  manifesto de imagens: ${lista.length} arquivos`)
    },
  }
}

export default defineConfig({
  plugins: [react(), imagesManifest()],

  // base relativo: o index.html gerado passa a apontar para "./assets/..."
  // em vez de "/assets/...". Continua funcionando igual servido por HTTP e
  // é o que permite abrir o build direto por file:// dentro do Electron.
  // OBS: os caminhos de ./images e /font são strings absolutas no código e
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
