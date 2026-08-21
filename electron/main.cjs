const { app, BrowserWindow, ipcMain, protocol, session } = require("electron");
const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");

const DIST = path.join(__dirname, "..", "dist");

// ---------------------------------------------------------------------------
// Máquina dedicada: o totem não divide CPU/GPU com nada. Estas flags desligam
// as economias que o Chromium faz pensando em notebook com bateria e em aba
// de fundo — no totem elas só atrapalham (frame atrasado depois de um tempo
// parado, timer engasgado, janela "ocupada" por outra do Windows).
// ---------------------------------------------------------------------------
app.commandLine.appendSwitch("disk-cache-size", String(512 * 1024 * 1024));
app.commandLine.appendSwitch("disable-background-timer-throttling");
app.commandLine.appendSwitch("disable-renderer-backgrounding");
app.commandLine.appendSwitch("disable-backgrounding-occluded-windows");
// O Windows às vezes marca a janela fullscreen como oculta e o Chromium para
// de pintar. Em totem isso aparece como tela congelada.
app.commandLine.appendSwitch("disable-features", "CalculateNativeWinOcclusion");
app.commandLine.appendSwitch("force_high_performance_gpu");
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

// Duas cópias do app disputando a mesma tela = travamento garantido. Acontece
// quando o atalho de inicialização dispara junto com um clique do operador.
const temInstanciaUnica = app.requestSingleInstanceLock();
if (!temInstanciaUnica) app.quit();

protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true
    }
  }
]);

// ---------------------------------------------------------------------------
// Cache de bytes em RAM.
//
// dist/ inteiro tem ~33 MB. Ler isso uma vez para a memória e servir dali
// significa que nenhuma imagem depende mais do disco: nem do HD, nem do cache
// de arquivos do Windows, que o SO pode reaproveitar para outra coisa a
// qualquer momento. Depois do boot, `app://` nunca mais toca o disco.
// ---------------------------------------------------------------------------
const CACHE_LIMIT = 512 * 1024 * 1024;
const cache = new Map(); // caminho relativo -> Buffer
let cachedBytes = 0;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".mp4": "video/mp4",
  ".webm": "video/webm"
};

const mimeOf = (rel) => MIME[path.extname(rel).toLowerCase()] || "application/octet-stream";

// index.html e o manifesto mudam a cada build; o resto pode ficar imutável,
// que é o que faz o Chromium manter a imagem viva no cache de memória do
// renderer em vez de buscá-la de novo a cada troca de tela.
const isVolatile = (rel) => rel === "index.html" || rel === "images-manifest.json";

function put(rel, buf) {
  if (cache.has(rel) || cachedBytes + buf.length > CACHE_LIMIT) return;
  cache.set(rel, buf);
  cachedBytes += buf.length;
}

/** Sobe dist/ inteiro para a RAM, em segundo plano, sem atrasar a janela. */
async function prefill(dir = DIST, base = "") {
  let entries;
  try {
    entries = await fsp.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      await prefill(path.join(dir, entry.name), rel);
      continue;
    }
    if (cache.has(rel)) continue;
    try {
      put(rel, await fsp.readFile(path.join(dir, entry.name)));
    } catch {
      /* arquivo ilegível não pode derrubar o preenchimento do resto */
    }
  }
}

/**
 * O cache HTTP do `app://` sobrevive entre execuções, gravado em userData.
 * Com `immutable` nos assets, uma versão nova do app continuaria servindo as
 * imagens antigas. Limpar quando o build muda resolve a classe inteira de
 * "atualizei e o totem mostra o conteúdo velho".
 */
async function invalidateOnNewBuild() {
  const stampFile = path.join(app.getPath("userData"), "build-stamp");
  let current = "dev";
  try {
    const st = fs.statSync(path.join(DIST, "index.html"));
    current = `${st.mtimeMs}:${st.size}`;
  } catch {
    /* sem dist/ o loadURL falha adiante, de forma visível */
  }

  let previous = null;
  try {
    previous = fs.readFileSync(stampFile, "utf8");
  } catch {
    /* primeira execução */
  }

  if (previous !== current) {
    await session.defaultSession.clearCache();
    try {
      fs.writeFileSync(stampFile, current);
    } catch {
      /* userData somente-leitura: pior caso, limpa o cache todo boot */
    }
  }
}

function registerProtocol() {
  protocol.handle("app", async (request) => {
    const url = new URL(request.url);
    let rel = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    if (!rel) rel = "index.html";

    const abs = path.resolve(DIST, rel);
    if (abs !== DIST && !abs.startsWith(DIST + path.sep)) {
      return new Response("Forbidden", { status: 403 });
    }

    let buf = cache.get(rel);
    if (!buf) {
      // Miss só acontece antes de o prefill chegar neste arquivo: lê do disco
      // uma vez e já promove para a RAM.
      try {
        buf = await fsp.readFile(abs);
        put(rel, buf);
      } catch {
        return new Response("Not found", { status: 404 });
      }
    }

    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type": mimeOf(rel),
        "Content-Length": String(buf.length),
        "Cache-Control": isVolatile(rel)
          ? "no-cache"
          : "public, max-age=31536000, immutable"
      }
    });
  });
}

let win = null;
let shown = false;
let quitting = false;
let recoveries = [];

app.on("before-quit", () => {
  quitting = true;
});

function reveal(origem) {
  if (shown || !win || win.isDestroyed()) return;
  shown = true;
  // "watchdog" aqui significa que o aquecimento não avisou a tempo: vale
  // investigar, porque a primeira tela vai aparecer sem estar pronta.
  console.log(`[totem] janela visível (${origem})`);
  win.show();
  win.focus();
}

function createWindow() {
  win = new BrowserWindow({
    width: 1080,
    height: 1920,
    fullscreen: true,
    autoHideMenuBar: true,
    // A janela só aparece quando o renderer avisa que as imagens da primeira
    // tela já estão decodificadas. Evita o flash branco e o "monta vazio,
    // depois preenche" que o operador lê como travada na abertura.
    show: false,
    backgroundColor: "#0b1426",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      // Sem isto o Chromium reduz timers e rAF quando acha que a janela não
      // está em primeiro plano — no totem, nunca está errado deixar ligado.
      backgroundThrottling: false
    }
  });

  // Rede de segurança: se o aquecimento falhar ou demorar, a tela aparece
  // assim mesmo. Melhor um totem com imagem chegando aos poucos do que um
  // totem preto.
  const watchdog = setTimeout(() => reveal("watchdog"), 12000);
  ipcMain.removeAllListeners("kiosk:ready");
  ipcMain.on("kiosk:ready", () => {
    clearTimeout(watchdog);
    reveal("aquecimento");
  });

  // Recuperação automática: renderer morto volta sozinho. O limite evita um
  // laço de recarregar-e-morrer quando o problema é permanente.
  const recover = (motivo) => {
    // Durante o encerramento o renderer morre por definição; recarregar aí só
    // cria corrida com o quit.
    if (quitting) return;
    const agora = Date.now();
    recoveries = recoveries.filter((t) => agora - t < 5 * 60 * 1000);
    recoveries.push(agora);
    console.error(`[totem] recuperando de: ${motivo} (${recoveries.length}/5)`);
    if (recoveries.length > 5) {
      app.relaunch();
      app.exit(0);
      return;
    }
    shown = false;
    if (win && !win.isDestroyed()) win.reload();
  };

  win.webContents.on("render-process-gone", (_e, details) => {
    if (details.reason === "clean-exit") return;
    recover(`render-process-gone:${details.reason}`);
  });
  win.webContents.on("unresponsive", () => recover("unresponsive"));

  // O totem roda sem ninguém olhando o DevTools. Encaminhar as linhas de
  // diagnóstico do renderer para a saída do processo principal é o que permite
  // conferir o aquecimento pelo log da máquina.
  win.webContents.on("console-message", (evento, ...resto) => {
    // Electron >= 36 entrega um objeto de evento; versões antigas passavam
    // (evento, nivel, mensagem). Aceita as duas para não depender da versão.
    const mensagem = typeof evento?.message === "string" ? evento.message : resto[1];
    if (typeof mensagem === "string" && mensagem.startsWith("[totem]")) {
      console.log(mensagem);
    }
  });

  win.loadURL("app://linde/");
}

app.on("second-instance", () => {
  if (win && !win.isDestroyed()) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

if (temInstanciaUnica) {
  app.whenReady().then(async () => {
    registerProtocol();
    await invalidateOnNewBuild();
    createWindow();
    // Depois da janela: o prefill não pode atrasar o primeiro pixel. O que a
    // primeira tela pedir antes de ele chegar lá é servido pelo miss.
    prefill().then(() => {
      console.log(
        `[totem] ${cache.size} arquivos em RAM (${(cachedBytes / 1048576).toFixed(1)} MB)`
      );
    });
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
