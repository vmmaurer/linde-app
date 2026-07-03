import React from 'react';
import Galeria from './Galeria';
import './HeroSection.css';

const EstruturaSection = () => {
  return (
    <section
      className="hero-section"
      style={{
        justifyContent: 'flex-start',
        overflowY: 'auto',
        minHeight: '100vh',
        width: '100%',
        padding: 0,
        margin: 0,
        background: 'linear-gradient(180deg, #040b19 0%, #405b7a 50%, #040b19 100%)',
        display: 'block',
      }}
    >
      <div className="grid-overlay" />
      <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <Galeria />
      </div>
    </section>
  );
};

export default EstruturaSection;