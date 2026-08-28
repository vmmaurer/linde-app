import React, { useState, useEffect, useRef } from 'react';
import HeroSection from './components/HeroSection';
import CTASection from './components/CTASection';
import EstruturaSection from './components/EstruturaSection';
import HistoriaSection from './components/HistoriaSection';
import BottomNav from './components/BottomNav';
import SorteioButton from './components/SorteioButton';
import SorteioModal from './components/SorteioModal';
import { warmupAssets } from './utils/preloadAssets';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('produtos');
  const [modalOpen, setModalOpen] = useState(false);
  // O pop-up do sorteio vive aqui, e não dentro do SorteioButton: ao abrir,
  // ele dispara modal-open e o botão é desmontado — se o estado morasse lá,
  // o pop-up sumiria junto.
  const [sorteioAberto, setSorteioAberto] = useState(false);
  const idleTimer = useRef(null);
  const navReturnTimer = useRef(null);

  // Aquece as imagens assim que o totem sobe. Como ele fica ligado o dia
  // inteiro, quando a primeira pessoa encosta na tela já está tudo
  // decodificado em memória — a troca de tela não espera por disco nem por
  // decodificação, que era a origem do engasgo.
  useEffect(() => { warmupAssets(); }, []);

  const clearIdleTimer = () => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
  };

  const resetIdleTimer = () => {
    clearIdleTimer();

    // Consulta apenas os vídeos que realmente estão na página. Assim, um
    // vídeo removido ao fechar o modal ou trocar de mídia nunca deixa a
    // contagem de inatividade bloqueada.
    const hasPlayingVideo = Array.from(document.querySelectorAll('video'))
      .some((video) => !video.paused && !video.ended);
    if (hasPlayingVideo) return;

    // O timer roda SEMPRE (inclusive com card aberto). Numa feira, se
    // alguém abre e abandona, após 30s o card fecha e volta pra tela
    // inicial. Qualquer toque na tela reinicia esta contagem.
    idleTimer.current = setTimeout(() => {
      // fecha qualquer modal/card aberto (o ProductModal escuta este evento)
      window.dispatchEvent(new CustomEvent('force-close-modal'));
      setCurrentScreen('produtos');
    }, 30000);
  };

  useEffect(() => {
    const handleVideoPlaying = (event) => {
      if (!(event.target instanceof HTMLVideoElement)) return;
      clearIdleTimer();
    };

    const handleVideoStopped = (event) => {
      if (!(event.target instanceof HTMLVideoElement)) return;
      resetIdleTimer();
    };

    const removedVideoObserver = new MutationObserver((mutations) => {
      const removedVideo = mutations.some((mutation) =>
        Array.from(mutation.removedNodes).some((node) =>
          node instanceof HTMLVideoElement
          || (node instanceof Element && node.querySelector('video'))
        )
      );

      if (removedVideo) resetIdleTimer();
    });

    window.addEventListener('mousedown', resetIdleTimer);
    window.addEventListener('touchstart', resetIdleTimer);
    // Eventos de mídia não sobem pela árvore; a captura permite cobrir todos
    // os vídeos atuais e futuros do site sem acoplar a regra aos componentes.
    document.addEventListener('playing', handleVideoPlaying, true);
    document.addEventListener('pause', handleVideoStopped, true);
    document.addEventListener('ended', handleVideoStopped, true);
    document.addEventListener('emptied', handleVideoStopped, true);
    document.addEventListener('error', handleVideoStopped, true);
    removedVideoObserver.observe(document.body, { childList: true, subtree: true });
    resetIdleTimer();

    return () => {
      window.removeEventListener('mousedown', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
      document.removeEventListener('playing', handleVideoPlaying, true);
      document.removeEventListener('pause', handleVideoStopped, true);
      document.removeEventListener('ended', handleVideoStopped, true);
      document.removeEventListener('emptied', handleVideoStopped, true);
      document.removeEventListener('error', handleVideoStopped, true);
      removedVideoObserver.disconnect();
      clearIdleTimer();
    };
  }, []);

  // Controla o modal e o reaparecimento da navbar.
  //  - Ao ABRIR: navbar some na hora.
  //  - Ao FECHAR: a navbar só volta após um pequeno atraso (400ms). Isso
  //    evita que o mesmo toque que fecha o card (no botão X, que fica no
  //    lugar da navbar) atinja a navbar recém-reaparecida e troque de tela.
  useEffect(() => {
    const open = () => {
      if (navReturnTimer.current) clearTimeout(navReturnTimer.current);
      setModalOpen(true);
    };
    const close = () => {
      if (navReturnTimer.current) clearTimeout(navReturnTimer.current);
      navReturnTimer.current = setTimeout(() => setModalOpen(false), 400);
    };
    window.addEventListener('modal-open', open);
    window.addEventListener('modal-close', close);
    return () => {
      window.removeEventListener('modal-open', open);
      window.removeEventListener('modal-close', close);
      if (navReturnTimer.current) clearTimeout(navReturnTimer.current);
    };
  }, []);

  // Bloqueia zoom por pinça, duplo-toque e Ctrl+scroll (modo totem).
  // Usa { capture: true } para interceptar o gesto de pinça ANTES dos
  // componentes internos (carrossel da História, galeria da Estrutura),
  // garantindo que funcione em TODAS as telas.
  useEffect(() => {
    const prevent = (e) => e.preventDefault();

    const onTouchStart = (e) => {
    if (e.touches.length > 1) e.preventDefault();
    };
    const onTouchMove = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    let lastTouchEnd = 0;
    const onTouchEnd = (e) => {
      const now = Date.now();
      // Duplo-toque em menos de 300ms = zoom → bloqueia
      if (now - lastTouchEnd <= 300) e.preventDefault();
      lastTouchEnd = now;
    };

    const onWheel = (e) => { if (e.ctrlKey) e.preventDefault(); };
    const onKeyDown = (e) => {
      if (e.ctrlKey && ['+', '-', '=', '0'].includes(e.key)) e.preventDefault();
    };

    // capture:true => intercepta na descida do evento, antes dos filhos
    const optsCapture = { passive: false, capture: true };

    document.addEventListener('gesturestart', prevent, optsCapture);
    document.addEventListener('gesturechange', prevent, optsCapture);
    document.addEventListener('gestureend', prevent, optsCapture);
    document.addEventListener('touchstart', onTouchStart, optsCapture);
    document.addEventListener('touchmove', onTouchMove, optsCapture);
    document.addEventListener('touchend', onTouchEnd, { passive: false });
    document.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('gesturestart', prevent, optsCapture);
      document.removeEventListener('gesturechange', prevent, optsCapture);
      document.removeEventListener('gestureend', prevent, optsCapture);
      document.removeEventListener('touchstart', onTouchStart, optsCapture);
      document.removeEventListener('touchmove', onTouchMove, optsCapture);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  // Renderiza SÓ a tela ativa (em vez de manter as 4 montadas no slider).
  // Isso evita que telas pesadas fiquem sempre carregadas, que era a
  // causa da travada ao trocar de tela.
  const renderScreen = () => {
    switch (currentScreen) {
      case 'produtos':  return <HeroSection />;
      case 'estrutura': return <EstruturaSection />;
      case 'historia':  return <HistoriaSection />;
      case 'contato':   return <CTASection />;
      default:          return <HeroSection />;
  }
  };

  return (
    <div
      className="app-root-fullheight"
      style={{
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        // Azul profundo em vez de preto: durante o fade a tela nova é
        // translúcida por um instante e deixa esta cor aparecer. Com #000 dava
        // um "piscar" escuro entre as telas; com o azul da paleta a passagem
        // fica contínua.
        backgroundColor: '#0b1426',
      }}
    >
      <style>{`
        .app-root-fullheight {
          height: 100vh;
          height: 100dvh;
        }
        /* Só opacidade: é a única propriedade que o compositor resolve na GPU
           sem repintar a árvore inteira a cada frame. */
        @keyframes screenFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .screen-swap {
          flex: 1;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          animation: screenFade 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
          /* Promove a tela à própria camada ANTES do fade começar. Sem isto o
             Chromium só decide promover no primeiro frame da animação, e esse
             frame sai atrasado — é o solavanco no início da transição. */
          will-change: opacity;
        }
        /* Camada devolvida assim que o fade acaba: manter will-change para
           sempre em 4 telas de 1080x1920 seguraria VRAM à toa. */
        .screen-swap.is-settled {
          will-change: auto;
        }
      `}</style>

      {/* key força o React a remontar (e animar) ao trocar de tela.
          Como só a tela ativa existe, cada tela só monta quando entra
          e é desmontada ao sair — liberando memória. */}
      <div
        key={currentScreen}
        className="screen-swap"
        onAnimationEnd={(e) => e.currentTarget.classList.add('is-settled')}
      >
        {renderScreen()}
      </div>

      {/* Atalho do sorteio — mesma regra da navbar: some enquanto um card
          está aberto, para não competir com o pop-up. */}
      {!modalOpen && (
        <SorteioButton
          label={'Clique aqui para\nconcorrer a prêmios!'}
          onPress={() => { setSorteioAberto(true); resetIdleTimer(); }}
        />
      )}

      {sorteioAberto && <SorteioModal onClose={() => setSorteioAberto(false)} />}

      {!modalOpen && (
        <BottomNav
          currentScreen={currentScreen}
          onScreenChange={(screen) => { setCurrentScreen(screen); resetIdleTimer(); }}
        />
      )}
    </div>
  );
};

export default App;
