const {
  app,
  BrowserWindow,
  ipcMain,
  protocol,
  session,
  Menu
} = require("electron");

const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");

const DIST = path.join(__dirname, "..", "dist");

// ---------------------------------------------------------------------------
// Máquina dedicada: o totem não divide CPU/GPU com nada. Estas flags desligam
// as economias que o Chromium faz pensando em notebook com bateria e em aba
// de fundo.
// ---------------------------------------------------------------------------
app.commandLine.appendSwitch("disk-cache-size", String(512 * 1024 * 1024));
app.commandLine.appendSwitch("disable-background-timer-throttling");
app.commandLine.appendSwitch("disable-renderer-backgrounding");
app.commandLine.appendSwitch("disable-backgrounding-occluded-windows");
app.commandLine.appendSwitch(
  "disable-features",
  "CalculateNativeWinOcclusion"
);
app.commandLine.appendSwitch("force_high_performance_gpu");
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

// ---------------------------------------------------------------------------
// Impede duas instâncias do totem ao mesmo tempo.
// ---------------------------------------------------------------------------
const temInstanciaUnica = app.requestSingleInstanceLock();

if (!temInstanciaUnica) {
  app.quit();
}

// ---------------------------------------------------------------------------
// Protocolo app://
// ---------------------------------------------------------------------------
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
// Cache de arquivos em RAM.
// ---------------------------------------------------------------------------
const CACHE_LIMIT = 512 * 1024 * 1024;

const cache = new Map();

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

const mimeOf = (rel) =>
  MIME[path.extname(rel).toLowerCase()] ||
  "application/octet-stream";

// index.html e manifesto podem mudar entre builds.
const isVolatile = (rel) =>
  rel === "index.html" ||
  rel === "images-manifest.json";

function put(rel, buf) {
  if (
    cache.has(rel) ||
    cachedBytes + buf.length > CACHE_LIMIT
  ) {
    return;
  }

  cache.set(rel, buf);
  cachedBytes += buf.length;
}

// ---------------------------------------------------------------------------
// Pré-carrega dist/ para RAM.
// ---------------------------------------------------------------------------
async function prefill(dir = DIST, base = "") {
  let entries;

  try {
    entries = await fsp.readdir(dir, {
      withFileTypes: true
    });
  } catch {
    return;
  }

  for (const entry of entries) {
    const rel = base
      ? `${base}/${entry.name}`
      : entry.name;

    if (entry.isDirectory()) {
      await prefill(
        path.join(dir, entry.name),
        rel
      );

      continue;
    }

    if (cache.has(rel)) {
      continue;
    }

    try {
      put(
        rel,
        await fsp.readFile(
          path.join(dir, entry.name)
        )
      );
    } catch {
      // Arquivo ilegível não interrompe o restante.
    }
  }
}

// ---------------------------------------------------------------------------
// Limpa cache do Chromium quando houver um build novo.
// ---------------------------------------------------------------------------
async function invalidateOnNewBuild() {
  const stampFile = path.join(
    app.getPath("userData"),
    "build-stamp"
  );

  let current = "dev";

  try {
    const st = fs.statSync(
      path.join(DIST, "index.html")
    );

    current = `${st.mtimeMs}:${st.size}`;
  } catch {
    // Sem dist, o erro aparecerá no carregamento.
  }

  let previous = null;

  try {
    previous = fs.readFileSync(
      stampFile,
      "utf8"
    );
  } catch {
    // Primeira execução.
  }

  if (previous !== current) {
    await session.defaultSession.clearCache();

    try {
      fs.writeFileSync(
        stampFile,
        current
      );
    } catch {
      // Caso userData esteja somente leitura.
    }
  }
}

// ---------------------------------------------------------------------------
// Registra o protocolo app://
// ---------------------------------------------------------------------------
function registerProtocol() {
  protocol.handle(
    "app",
    async (request) => {
      const url = new URL(request.url);

      let rel = decodeURIComponent(
        url.pathname
      ).replace(/^\/+/, "");

      if (!rel) {
        rel = "index.html";
      }

      const abs = path.resolve(
        DIST,
        rel
      );

      // Impede acesso fora de dist/.
      if (
        abs !== DIST &&
        !abs.startsWith(DIST + path.sep)
      ) {
        return new Response(
          "Forbidden",
          {
            status: 403
          }
        );
      }

      let buf = cache.get(rel);

      if (!buf) {
        try {
          buf = await fsp.readFile(abs);

          put(rel, buf);
        } catch {
          return new Response(
            "Not found",
            {
              status: 404
            }
          );
        }
      }

      return new Response(buf, {
        status: 200,

        headers: {
          "Content-Type": mimeOf(rel),

          "Content-Length":
            String(buf.length),

          "Cache-Control":
            isVolatile(rel)
              ? "no-cache"
              : "public, max-age=31536000, immutable"
        }
      });
    }
  );
}

// ---------------------------------------------------------------------------
// Janela principal.
// ---------------------------------------------------------------------------
let win = null;

let shown = false;

let quitting = false;

let recoveries = [];

app.on("before-quit", () => {
  quitting = true;
});

// ---------------------------------------------------------------------------
// Exibe a janela somente depois do aquecimento inicial.
// ---------------------------------------------------------------------------
function reveal(origem) {
  if (
    shown ||
    !win ||
    win.isDestroyed()
  ) {
    return;
  }

  shown = true;

  console.log(
    `[totem] janela visível (${origem})`
  );

  win.show();
  win.focus();
}

// ---------------------------------------------------------------------------
// Criação da janela.
// ---------------------------------------------------------------------------
function createWindow() {
  win = new BrowserWindow({

    // ---------------------------------------------------------------
    // TAMANHO DO TOTEM
    // ---------------------------------------------------------------
    width: 1080,
    height: 1920,

    // ---------------------------------------------------------------
    // MODO TOTEM / KIOSK
    // ---------------------------------------------------------------

    // Kiosk é mais restritivo que apenas fullscreen.
    kiosk: true,

    fullscreen: true,

    // Remove completamente a moldura do Windows.
    frame: false,

    // Nenhuma barra de menus.
    autoHideMenuBar: true,

    // Usuário touch não pode alterar tamanho da janela.
    resizable: false,

    // Impede minimizar por controles da própria janela.
    minimizable: false,

    // Impede maximizar/restaurar por controles da janela.
    maximizable: false,

    // A janela continua escondida durante o aquecimento.
    show: false,

    backgroundColor: "#0b1426",

    webPreferences: {
      preload: path.join(
        __dirname,
        "preload.cjs"
      ),

      contextIsolation: true,

      nodeIntegration: false,

      // Mantém animações/timers ativos normalmente.
      backgroundThrottling: false
    }
  });

  // -----------------------------------------------------------------
  // REMOVE MENU DO ELECTRON
  // -----------------------------------------------------------------
  Menu.setApplicationMenu(null);

  win.setMenuBarVisibility(false);

  // -----------------------------------------------------------------
  // BLOQUEIA MENU DE CONTEXTO
  //
  // Evita menu ao:
  // - segurar o dedo;
  // - clique direito;
  // - long press.
  //
  // Não interfere em clique normal, scroll ou touch do site.
  // -----------------------------------------------------------------
  win.webContents.on(
    "context-menu",
    (event) => {
      event.preventDefault();
    }
  );

  // -----------------------------------------------------------------
  // IMPORTANTE:
  //
  // NÃO estamos bloqueando atalhos de teclado.
  //
  // Portanto um técnico ainda poderá usar teclado físico para manutenção.
  // -----------------------------------------------------------------

  // -----------------------------------------------------------------
  // Watchdog de inicialização.
  // -----------------------------------------------------------------
  const watchdog = setTimeout(
    () => reveal("watchdog"),
    12000
  );

  ipcMain.removeAllListeners(
    "kiosk:ready"
  );

  ipcMain.on(
    "kiosk:ready",
    () => {
      clearTimeout(watchdog);

      reveal("aquecimento");
    }
  );

  // -----------------------------------------------------------------
  // Recuperação automática do renderer.
  // -----------------------------------------------------------------
  const recover = (motivo) => {
    if (quitting) {
      return;
    }

    const agora = Date.now();

    recoveries =
      recoveries.filter(
        (t) =>
          agora - t <
          5 * 60 * 1000
      );

    recoveries.push(agora);

    console.error(
      `[totem] recuperando de: ${motivo} (${recoveries.length}/5)`
    );

    if (recoveries.length > 5) {
      app.relaunch();
      app.exit(0);

      return;
    }

    shown = false;

    if (
      win &&
      !win.isDestroyed()
    ) {
      win.reload();
    }
  };

  win.webContents.on(
    "render-process-gone",
    (_e, details) => {
      if (
        details.reason ===
        "clean-exit"
      ) {
        return;
      }

      recover(
        `render-process-gone:${details.reason}`
      );
    }
  );

  win.webContents.on(
    "unresponsive",
    () => {
      recover("unresponsive");
    }
  );

  // -----------------------------------------------------------------
  // Encaminha logs [totem] do renderer para o processo principal.
  // -----------------------------------------------------------------
  win.webContents.on(
    "console-message",
    (evento, ...resto) => {
      const mensagem =
        typeof evento?.message ===
        "string"
          ? evento.message
          : resto[1];

      if (
        typeof mensagem ===
          "string" &&
        mensagem.startsWith(
          "[totem]"
        )
      ) {
        console.log(mensagem);
      }
    }
  );

  // -----------------------------------------------------------------
  // CARREGA O SITE
  // -----------------------------------------------------------------
  win.loadURL("app://linde/");
}

// ---------------------------------------------------------------------------
// Se tentarem abrir o aplicativo novamente, traz o atual para frente.
// ---------------------------------------------------------------------------
app.on(
  "second-instance",
  () => {
    if (
      win &&
      !win.isDestroyed()
    ) {
      if (win.isMinimized()) {
        win.restore();
      }

      win.focus();
    }
  }
);

// ---------------------------------------------------------------------------
// Inicialização.
// ---------------------------------------------------------------------------
if (temInstanciaUnica) {
  app.whenReady().then(
    async () => {
      // Remove menu global do aplicativo.
      Menu.setApplicationMenu(null);

      registerProtocol();

      await invalidateOnNewBuild();

      createWindow();

      // Preenche cache depois da janela existir.
      prefill().then(() => {
        console.log(
          `[totem] ${cache.size} arquivos em RAM (${(
            cachedBytes / 1048576
          ).toFixed(1)} MB)`
        );
      });
    }
  );
}

// ---------------------------------------------------------------------------
// Encerramento.
// ---------------------------------------------------------------------------
app.on(
  "window-all-closed",
  () => {
    if (
      process.platform !==
      "darwin"
    ) {
      app.quit();
    }
  }
);