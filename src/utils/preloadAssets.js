import { products } from '../data/products';
import { milestones } from '../components/LinhaDoTempo';
import { features } from '../components/EstruturaSection';

/**
 * Aquecimento de imagens do totem.
 *
 * A máquina roda só este app, então a estratégia é a mais agressiva possível:
 * TODA imagem de public/images é buscada no boot e, enquanto houver orçamento
 * de memória, também decodificada e mantida viva em RAM. No instante em que o
 * dedo toca a tela, o bitmap já existe — não há leitura de disco nem
 * decodificação para fazer dentro do frame.
 *
 * Por que existe orçamento em vez de "decodifica tudo e pronto":
 * as 135 imagens somam ~30 MB em disco, mas ~675 MB descomprimidas (RGBA).
 * Decodificar tudo às cegas num PC de 4 GB é exatamente como se produz o
 * crash que se queria evitar. Então decodificamos em ordem de prioridade até
 * o teto, e o que sobra fica com os bytes quentes (cache de memória do
 * Chromium, servido pelo processo principal a partir da RAM — ver
 * electron/main.cjs). Decodificar a partir daí custa poucos ms.
 *
 * Ordem de prioridade:
 *   1. quentes   — fundos das 4 telas + navbar + logo. É o que a troca de
 *                  tela realmente espera. Roda antes de a janela aparecer.
 *   2. mornas    — capas visíveis sem abrir nada (carrossel, linha do tempo,
 *                  estrutura) e os elementos da tela de contato.
 *   3. galerias  — mídias que só existem dentro dos pop-ups.
 *   4. restante  — qualquer arquivo do manifesto ainda não coberto acima.
 *
 * As camadas 2-4 rodam em requestIdleCallback para nunca disputar frame com o
 * carrossel, que é a primeira coisa que o visitante vê se mexendo.
 */

// Segurar as Image decodificadas num escopo de módulo é o que impede o GC de
// jogar o bitmap fora entre uma troca de tela e outra.
const retained = [];

const SCREEN_BACKGROUNDS = [
  './images/totem.webp',                    // Produtos
  './images/FUNDO-PAGINA-ESTRUTURA1.webp',  // Estrutura
  './images/FUNDO-PAGINA-HISTORIA.webp',    // História
  './images/FUNDO-PAGINA-CONTATO.webp',     // Contato
];

const CHROME = [
  './images/logonavbar.webp',
  './images/NAV-FLAT-PRODUTOS.webp',
  './images/NAV-FLAT-ESTRUTURA.webp',
  './images/NAV-FLAT-EMPRESA.webp',
  './images/NAV FLAT CONTATO.webp',
];

// Tela de contato: não sai de products/milestones/features, então precisa
// estar aqui para não ficar de fora da camada 2.
const CONTATO = [
  './images/ICON_INSTAGRAM.webp',
  './images/ICON_WHATS.webp',
  './images/qrcode_linktree_totem.webp',
  './images/REGIAO 4.gif',
];

const isImage = (src) => typeof src === 'string' && /\.(webp|png|jpe?g|gif|avif)$/i.test(src);

const mediaOf = (entry) => (entry.media || []).filter((m) => m.type === 'image').map((m) => m.src);

/** Capas: o que aparece sem precisar abrir nada. */
const covers = () => [
  ...products.map((p) => p.image),
  ...products.map((p) => p.brandLogo),
  ...milestones.map((m) => m.image),
  ...features.map((f) => f.image),
];

/** Mídias que só existem dentro dos pop-ups. */
const galleries = () => [
  ...products.flatMap(mediaOf),
  ...products.map((p) => p.modalImage),
  ...features.flatMap(mediaOf),
];

const unique = (list) => [...new Set(list.filter(isImage))];

// ---------------------------------------------------------------------------
// Orçamento de memória para bitmaps decodificados.
//
// navigator.deviceMemory devolve a RAM da máquina em GB (aproximada, teto de
// 8 no Chromium). Um terço dela é o que dá para segurar em bitmaps sem
// competir com o próprio Chromium — que ainda precisa de heap, GPU e
// compositor. O teto de 1,2 GB cobre com folga os ~675 MB do acervo atual.
// ---------------------------------------------------------------------------
const deviceMemoryMB = (navigator.deviceMemory || 4) * 1024;
const DECODE_BUDGET = Math.min(1200, Math.max(256, Math.round(deviceMemoryMB / 3))) * 1048576;
let decodedBytes = 0;

/** Custo real do bitmap: largura x altura x 4 bytes (RGBA). */
const bitmapCost = (img) => (img.naturalWidth || 0) * (img.naturalHeight || 0) * 4;

/**
 * Estado por arquivo: 'bytes' (baixado) ou 'decoded' (bitmap vivo em RAM).
 *
 * O unique() de cada camada só desduplica dentro dela — a mesma foto aparece
 * como capa e de novo dentro da galeria do produto. Sem esta trava a imagem
 * era carregada duas vezes e o orçamento contava o dobro do custo real.
 */
const warmed = new Map();

function load(src, { decode, keep }) {
  const estado = warmed.get(src);
  // Já decodificada não tem o que refazer. Já baixada só volta à fila se
  // agora o pedido for para decodificar.
  if (estado === 'decoded' || (estado === 'bytes' && !decode)) return Promise.resolve();

  return new Promise((resolve) => {
    const img = new Image();
    // Sem isto, o navegador trata o preload com a mesma prioridade de uma
    // imagem fora da viewport e ele acaba chegando depois do que precisamos.
    img.fetchPriority = keep ? 'high' : 'low';
    img.decoding = 'async';
    img.onload = () => {
      const custo = bitmapCost(img);
      // Só decodifica e segura se couber no orçamento. Estourar aqui é o que
      // transforma "tudo em cache" em tela morta por falta de memória.
      const cabe = decodedBytes + custo <= DECODE_BUDGET;
      const vaiDecodificar = decode && cabe;
      warmed.set(src, vaiDecodificar ? 'decoded' : 'bytes');

      if (keep && cabe) {
        retained.push(img);
        decodedBytes += custo;
      }

      // decode() força o bitmap a existir AGORA, fora do frame de pintura.
      // Sem ele, o custo de decodificação só aparece — como engasgo — no
      // primeiro frame em que a imagem entra na tela.
      if (vaiDecodificar && img.decode) img.decode().then(resolve, resolve);
      else resolve();
      // Fora do orçamento a imagem não é perdida: os bytes ficam no cache de
      // memória do Chromium (o app:// os serve como immutable), e o processo
      // principal os mantém em RAM. O que resta é só a decodificação.
    };
    img.onerror = resolve; // um arquivo faltando não pode derrubar o aquecimento
    img.src = src;
  });
}

/** Roda a fila com um teto de paralelismo para não monopolizar o main thread. */
async function run(list, opts, concurrency = 4) {
  let cursor = 0;
  const worker = async () => {
    while (cursor < list.length) {
      await load(list[cursor++], opts);
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, list.length) }, worker));
}

const whenIdle = (fn) =>
  (window.requestIdleCallback || ((cb) => setTimeout(cb, 200)))(fn, { timeout: 3000 });

/**
 * Manifesto gerado pelo plugin em vite.config.js: lista TODA imagem de
 * public/images. É o que garante que uma foto nova adicionada ao projeto
 * entre no aquecimento sem ninguém precisar lembrar de editar este arquivo.
 */
async function manifest() {
  try {
    const res = await fetch('./images-manifest.json', { cache: 'force-cache' });
    if (!res.ok) return [];
    const list = await res.json();
    return Array.isArray(list) ? list : [];
  } catch {
    return []; // sem manifesto, as listas derivadas acima já cobrem o essencial
  }
}

let started = false;

export function warmupAssets() {
  if (started) return;
  started = true;

  const criticas = unique([...SCREEN_BACKGROUNDS, ...CHROME]);

  // Camada 1 agora: é ela que decide se a troca de tela pisca ou não, e é a
  // condição para a janela do Electron aparecer.
  run(criticas, { decode: true, keep: true }, 4)
    .then(() => {
      // Janela liberada: a primeira tela já tem tudo decodificado. O resto do
      // aquecimento continua atrás, sem ninguém esperando por ele.
      window.kiosk?.ready();
    })
    .then(() => new Promise((r) => whenIdle(r)))
    .then(() => run(unique([...covers(), ...CONTATO]), { decode: true, keep: true }, 3))
    .then(() => new Promise((r) => whenIdle(r)))
    .then(() => run(unique(galleries()), { decode: true, keep: true }, 2))
    .then(() => new Promise((r) => whenIdle(r)))
    .then(async () => {
      // Varredura final: o que existe na pasta e ainda não passou por aqui.
      const jaVistas = new Set([
        ...criticas,
        ...unique([...covers(), ...CONTATO]),
        ...unique(galleries()),
      ]);
      const restantes = unique(await manifest()).filter((src) => !jaVistas.has(src));
      // decode:false — são arquivos que hoje ninguém referencia; basta ter os
      // bytes quentes caso passem a ser usados.
      await run(restantes, { decode: false, keep: false }, 2);
    })
    .then(() => {
      console.log(
        `[totem] aquecimento concluído: ${retained.length} imagens decodificadas em RAM ` +
        `(${(decodedBytes / 1048576).toFixed(0)} MB de ${(DECODE_BUDGET / 1048576).toFixed(0)} MB)`
      );
    });
}

/**
 * Usado pelo carrossel do pop-up: aquece só os vizinhos do slide atual, para
 * que a seta seguinte responda no mesmo frame em que é tocada. Depois do
 * aquecimento completo isso normalmente já é um no-op — fica como garantia
 * para o caso de a imagem ter ficado fora do orçamento.
 */
export function warmNeighbors(sources) {
  unique(sources).forEach((src) => load(src, { decode: true, keep: false }));
}
