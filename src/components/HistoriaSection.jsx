import React from 'react';
import LinhaDoTempo from './LinhaDoTempo';
import './HeroSection.css';

const HistoriaSection = () => {
  return (
    <section
      className="hero-section historia-fullheight"
      style={{
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        overflowY: 'hidden',
        padding: 0,
        background: 'linear-gradient(180deg, #040b19 0%, #405b7a 50%, #040b19 100%)',
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

      {/* Fades laterais */}
      {[['left', '90deg'], ['right', '270deg']].map(([side, deg]) => (
        <div
          key={side}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            [side]: 0,
            width: 80,
            background: `linear-gradient(${deg}, rgba(4,11,25,0.9) 0%, transparent 100%)`,
            pointerEvents: 'none',
            zIndex: 20,
          }}
        />
      ))}

      {/* Este wrapper precisa de height: 100% E flex: 1 para que
          a section do LinhaDoTempo receba uma altura real do pai */}
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