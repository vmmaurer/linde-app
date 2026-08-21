const {
  app,
  BrowserWindow,
  ipcMain,
  protocol,
  session,
  Menu,
  screen
} = require("electron");

const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");

const DIST = path.join(__dirname, "..", "dist");

// ---------------------------------------------------------------------------
// Máquina dedicada: evita economias do Chromium que podem prejudicar
// animações e timers em um totem que fica ligado continuamente.
// ---------------------------------------------------------------------------
app.commandLine.appendSwitch(
  "disk-cache-size",
  String(512 * 1024 * 1024)
);

app.commandLine.appendSwitch(
  "disable-background-timer-throttling"
);

app.commandLine.appendSwitch(
  "disable-renderer-backgrounding"
);

app.commandLine.appendSwitch(
  "disable-backgrounding-occluded-windows"
);

app.commandLine.appendSwitch(
  "disable-features",
  "CalculateNativeWinOcclusion"
);

app.commandLine.appendSwitch(
  "force_high_performance_gpu"
);

app.commandLine.appendSwitch(
  "autoplay-policy",
  "no-user-gesture-required"
);

// ---------------------------------------------------------------------------
// Impede duas instâncias do totem ao mesmo tempo.
// ---------------------------------------------------------------------------
const temInstanciaUnica =
  app.requestSingleInstanceLock();

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
const CACHE_LIMIT =
  512 * 1024 * 1024;

const cache = new Map();

let cachedBytes = 0;

const MIME = {
  ".html":
    "text/html; charset=utf-8",

  ".js":
    "text/javascript; charset=utf-8",

  ".mjs":
    "text/javascript; charset=utf-8",

  ".css":
    "text/css; charset=utf-8",

  ".json":
    "application/json; charset=utf-8",

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
  MIME[
    path.extname(rel).toLowerCase()
  ] ||
  "application/octet-stream";

const isVolatile = (rel) =>
  rel === "index.html" ||
  rel === "images-manifest.json";

function put(rel, buf) {
  if (
    cache.has(rel) ||
    cachedBytes + buf.length >
      CACHE_LIMIT
  ) {
    return;
  }

  cache.set(rel, buf);

  cachedBytes += buf.length;
}

// ---------------------------------------------------------------------------
// Pré-carrega dist/ em RAM.
// ---------------------------------------------------------------------------
async function prefill(
  dir = DIST,
  base = ""
) {
  let entries;

  try {
    entries =
      await fsp.readdir(
        dir,
        {
          withFileTypes: true
        }
      );
  } catch {
    return;
  }

  for (const entry of entries) {
    const rel =
      base
        ? `${base}/${entry.name}`
        : entry.name;

    if (entry.isDirectory()) {
      await prefill(
        path.join(
          dir,
          entry.name
        ),
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
          path.join(
            dir,
            entry.name
          )
        )
      );
    } catch {
      // Arquivo ilegível não
      // interrompe o restante.
    }
  }
}

// ---------------------------------------------------------------------------
// Limpa cache quando detectar build novo.
// ---------------------------------------------------------------------------
async function invalidateOnNewBuild() {
  const stampFile =
    path.join(
      app.getPath("userData"),
      "build-stamp"
    );

  let current = "dev";

  try {
    const st =
      fs.statSync(
        path.join(
          DIST,
          "index.html"
        )
      );

    current =
      `${st.mtimeMs}:${st.size}`;

  } catch {
    // Sem dist, o erro aparecerá
    // durante o carregamento.
  }

  let previous = null;

  try {
    previous =
      fs.readFileSync(
        stampFile,
        "utf8"
      );

  } catch {
    // Primeira execução.
  }

  if (previous !== current) {
    await session
      .defaultSession
      .clearCache();

    try {
      fs.writeFileSync(
        stampFile,
        current
      );

    } catch {
      // Caso userData esteja
      // somente leitura.
    }
  }
}

// ---------------------------------------------------------------------------
// Registra protocolo app://
// ---------------------------------------------------------------------------
function registerProtocol() {
  protocol.handle(
    "app",

    async (request) => {
      const url =
        new URL(request.url);

      let rel =
        decodeURIComponent(
          url.pathname
        ).replace(
          /^\/+/,
          ""
        );

      if (!rel) {
        rel = "index.html";
      }

      const abs =
        path.resolve(
          DIST,
          rel
        );

      // Impede sair de dist/.
      if (
        abs !== DIST &&
        !abs.startsWith(
          DIST + path.sep
        )
      ) {
        return new Response(
          "Forbidden",
          {
            status: 403
          }
        );
      }

      let buf =
        cache.get(rel);

      if (!buf) {
        try {
          buf =
            await fsp.readFile(
              abs
            );

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

      return new Response(
        buf,
        {
          status: 200,

          headers: {
            "Content-Type":
              mimeOf(rel),

            "Content-Length":
              String(
                buf.length
              ),

            "Cache-Control":
              isVolatile(rel)
                ? "no-cache"
                : "public, max-age=31536000, immutable"
          }
        }
      );
    }
  );
}

// ---------------------------------------------------------------------------
// Estado global da janela.
// ---------------------------------------------------------------------------
let win = null;

let shown = false;

let quitting = false;

let recoveries = [];

app.on(
  "before-quit",
  () => {
    quitting = true;
  }
);

// ---------------------------------------------------------------------------
// Força a janela a ocupar TODO o monitor.
//
// Isso não depende mais de 1080x1920.
// Pega automaticamente resolução, escala e orientação reais do Windows.
// ---------------------------------------------------------------------------
function aplicarTelaCheia() {
  if (
    !win ||
    win.isDestroyed()
  ) {
    return;
  }

  const display =
    screen.getPrimaryDisplay();

  const bounds =
    display.bounds;

  // Tamanho EXATO do monitor,
  // incluindo a região normalmente
  // ocupada pela barra de tarefas.
  win.setBounds(
    {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height
    },
    false
  );

  // Ativa novamente o modo kiosk.
  win.setKiosk(true);

  // Garante fullscreen.
  win.setFullScreen(true);

  // A janela fica acima inclusive
  // da barra de tarefas.
  win.setAlwaysOnTop(
    true,
    "screen-saver"
  );

  // Traz para o topo.
  win.moveTop();
}

// ---------------------------------------------------------------------------
// Exibe a janela somente depois do aquecimento.
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

  // Antes de mostrar, já força
  // posição/tamanho corretos.
  aplicarTelaCheia();

  win.show();

  // Reforça novamente depois
  // que o Windows realmente
  // tornou a janela visível.
  aplicarTelaCheia();

  win.focus();

  win.moveTop();
}

// ---------------------------------------------------------------------------
// Criação da janela.
// ---------------------------------------------------------------------------
function createWindow() {
  const display =
    screen.getPrimaryDisplay();

  const {
    x,
    y,
    width,
    height
  } = display.bounds;

  console.log(
    `[totem] monitor: ${width}x${height} em ${x},${y}`
  );

  win =
    new BrowserWindow({
      // ---------------------------------------------------------------
      // USA A RESOLUÇÃO REAL DO MONITOR
      // ---------------------------------------------------------------
      x,
      y,
      width,
      height,

      // ---------------------------------------------------------------
      // MODO TOTEM
      // ---------------------------------------------------------------
      kiosk: true,

      fullscreen: true,

      frame: false,

      autoHideMenuBar: true,

      resizable: false,

      minimizable: false,

      maximizable: false,

      // Não mostra o aplicativo
      // como botão normal da barra.
      skipTaskbar: true,

      // Mantém acima da taskbar.
      alwaysOnTop: true,

      // Continua invisível
      // enquanto ocorre o preload.
      show: false,

      backgroundColor:
        "#0b1426",

      webPreferences: {
        preload:
          path.join(
            __dirname,
            "preload.cjs"
          ),

        contextIsolation: true,

        nodeIntegration: false,

        backgroundThrottling:
          false
      }
    });

  // -----------------------------------------------------------------
  // REMOVE COMPLETAMENTE MENU DO ELECTRON
  // -----------------------------------------------------------------
  Menu.setApplicationMenu(
    null
  );

  win.setMenu(
    null
  );

  win.setMenuBarVisibility(
    false
  );

  // -----------------------------------------------------------------
  // FORÇA O NÍVEL DA JANELA ACIMA DA TASKBAR
  // -----------------------------------------------------------------
  win.setAlwaysOnTop(
    true,
    "screen-saver"
  );

  // -----------------------------------------------------------------
  // FORÇA TELA CHEIA REAL
  // -----------------------------------------------------------------
  aplicarTelaCheia();

  // -----------------------------------------------------------------
  // BLOQUEIA MENU DE CONTEXTO
  // -----------------------------------------------------------------
  win.webContents.on(
    "context-menu",

    (event) => {
      event.preventDefault();
    }
  );

  // -----------------------------------------------------------------
  // NÃO BLOQUEAMOS TECLADO.
  //
  // Assim, teclado físico continua
  // disponível para manutenção.
  // -----------------------------------------------------------------

  // -----------------------------------------------------------------
  // Quando o Windows mostrar a janela,
  // reforça novamente o modo fullscreen.
  // -----------------------------------------------------------------
  win.on(
    "show",
    () => {
      aplicarTelaCheia();
    }
  );

  // -----------------------------------------------------------------
  // Quando recuperar foco, reforça novamente.
  // -----------------------------------------------------------------
  win.on(
    "focus",
    () => {
      aplicarTelaCheia();
    }
  );

  // -----------------------------------------------------------------
  // Se por algum motivo o fullscreen for perdido,
  // força novamente.
  // -----------------------------------------------------------------
  win.on(
    "leave-full-screen",
    () => {
      if (!quitting) {
        setTimeout(
          () => {
            aplicarTelaCheia();
          },
          50
        );
      }
    }
  );

  // -----------------------------------------------------------------
  // Watchdog de inicialização.
  // -----------------------------------------------------------------
  const watchdog =
    setTimeout(
      () =>
        reveal(
          "watchdog"
        ),
      12000
    );

  ipcMain.removeAllListeners(
    "kiosk:ready"
  );

  ipcMain.on(
    "kiosk:ready",

    () => {
      clearTimeout(
        watchdog
      );

      reveal(
        "aquecimento"
      );
    }
  );

  // -----------------------------------------------------------------
  // Recuperação automática do renderer.
  // -----------------------------------------------------------------
  const recover =
    (motivo) => {
      if (quitting) {
        return;
      }

      const agora =
        Date.now();

      recoveries =
        recoveries.filter(
          (t) =>
            agora - t <
            5 * 60 * 1000
        );

      recoveries.push(
        agora
      );

      console.error(
        `[totem] recuperando de: ${motivo} (${recoveries.length}/5)`
      );

      if (
        recoveries.length > 5
      ) {
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
      recover(
        "unresponsive"
      );
    }
  );

  // -----------------------------------------------------------------
  // Encaminha logs [totem].
  // -----------------------------------------------------------------
  win.webContents.on(
    "console-message",

    (
      evento,
      ...resto
    ) => {
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
        console.log(
          mensagem
        );
      }
    }
  );

  // -----------------------------------------------------------------
  // CARREGA O SITE
  // -----------------------------------------------------------------
  win.loadURL(
    "app://linde/"
  );
}

// ---------------------------------------------------------------------------
// Segunda instância: traz a janela atual de volta.
// ---------------------------------------------------------------------------
app.on(
  "second-instance",

  () => {
    if (
      win &&
      !win.isDestroyed()
    ) {
      if (
        win.isMinimized()
      ) {
        win.restore();
      }

      aplicarTelaCheia();

      win.show();

      win.focus();

      win.moveTop();
    }
  }
);

// ---------------------------------------------------------------------------
// Se resolução, orientação ou escala do monitor mudar,
// recalcula automaticamente a tela cheia.
// ---------------------------------------------------------------------------
function monitorarTela() {
  screen.on(
    "display-metrics-changed",

    (
      _event,
      display
    ) => {
      if (
        display.id ===
        screen
          .getPrimaryDisplay()
          .id
      ) {
        setTimeout(
          () => {
            aplicarTelaCheia();
          },
          100
        );
      }
    }
  );
}

// ---------------------------------------------------------------------------
// Inicialização.
// ---------------------------------------------------------------------------
if (
  temInstanciaUnica
) {
  app.whenReady().then(
    async () => {
      Menu.setApplicationMenu(
        null
      );

      registerProtocol();

      await invalidateOnNewBuild();

      monitorarTela();

      createWindow();

      prefill().then(
        () => {
          console.log(
            `[totem] ${cache.size} arquivos em RAM (${(
              cachedBytes /
              1048576
            ).toFixed(1)} MB)`
          );
        }
      );
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