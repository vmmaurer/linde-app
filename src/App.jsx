import React, { useState, useEffect, useRef } from 'react';
import HeroSection from './components/HeroSection';
import CTASection from './components/CTASection';
import EstruturaSection from './components/EstruturaSection';
import HistoriaSection from './components/HistoriaSection';
import BottomNav from './components/BottomNav';

const SCREENS = ['produtos', 'estrutura', 'historia', 'contato'];

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('produtos');
  const [modalOpen, setModalOpen] = useState(false);
  const idleTimer = useRef(null);
  const navReturnTimer = useRef(null);
  const playingVideos = useRef(new Set());

  const clearIdleTimer = () => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
  };

  const resetIdleTimer = () => {
    clearIdleTimer();

    // Enquanto qualquer vídeo estiver tocando, a experiência não é
    // considerada inativa. A contagem recomeça quando o último vídeo parar.
    if (playingVideos.current.size > 0) return;
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
      playingVideos.current.add(event.target);
      clearIdleTimer();
    };

    const handleVideoStopped = (event) => {
      if (!(event.target instanceof HTMLVideoElement)) return;
      playingVideos.current.delete(event.target);
      resetIdleTimer();
    };

    window.addEventListener('mousedown', resetIdleTimer);
    window.addEventListener('touchstart', resetIdleTimer);
    // Eventos de mídia não sobem pela árvore; a captura permite cobrir todos
    // os vídeos atuais e futuros do site sem acoplar a regra aos componentes.
    document.addEventListener('playing', handleVideoPlaying, true);
    document.addEventListener('pause', handleVideoStopped, true);
    document.addEventListener('ended', handleVideoStopped, true);
    document.addEventListener('emptied', handleVideoStopped, true);
    document.addEventListener('error', handleVideoStopped, true);
    resetIdleTimer();

    return () => {
      window.removeEventListener('mousedown', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
      document.removeEventListener('playing', handleVideoPlaying, true);
      document.removeEventListener('pause', handleVideoStopped, true);
      document.removeEventListener('ended', handleVideoStopped, true);
      document.removeEventListener('emptied', handleVideoStopped, true);
      document.removeEventListener('error', handleVideoStopped, true);
      playingVideos.current.clear();
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
        backgroundColor: '#000',
      }}
    >
      <style>{`
        .app-root-fullheight {
          height: 100vh;
          height: 100dvh;
        }
        @keyframes screenFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* key força o React a remontar (e animar) ao trocar de tela.
          Como só a tela ativa existe, cada tela só monta quando entra
          e é desmontada ao sair — liberando memória. */}
      <div
        key={currentScreen}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          animation: 'screenFade 0.35s ease',
        }}
      >
        {renderScreen()}
      </div>

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
