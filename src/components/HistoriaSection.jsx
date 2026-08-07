import React from 'react';
import LinhaDoTempo from './LinhaDoTempo';
import './HeroSection.css';

// Fundo global da fachada aparece — section transparente.

const HistoriaSection = () => {
  return (
    <section
      className="hero-section historia-fullheight"
      style={{
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        overflowY: 'hidden',
        padding: 0,
        /* Fundo: imagem da História (já vem com azul embutido) + véu leve */
        backgroundImage:
          'linear-gradient(180deg, rgba(4,11,25,0.55) 0%, rgba(35,60,100,0.30) 45%, rgba(4,11,25,0.75) 100%), url(/images/FUNDO-PAGINA-HISTORIA.webp)',
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .historia-fullheight {
          height: 100vh;
          height: 100dvh;
        }
      `}</style>

      <div className="grid-overlay" />

      {/* Fades laterais — azul escuro para combinar com o fundo */}
      {[['left', '90deg'], ['right', '270deg']].map(([side, deg]) => (
        <div
          key={side}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            [side]: 0,
            width: 80,
            background: `linear-gradient(${deg}, rgba(4,11,25,0.85) 0%, transparent 100%)`,
            pointerEvents: 'none',
            zIndex: 20,
          }}
        />
      ))}

      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <LinhaDoTempo />
      </div>
    </section>
  );
};

export default HistoriaSection;