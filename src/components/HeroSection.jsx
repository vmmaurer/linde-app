import React, { useState } from 'react';
import { products } from '../data/products';
import ArcCarousel from './ArcCarousel';
import ProductModal from './ProductModal';
import './HeroSection.css';

// ── Paleta: Sapphire #233c64 · Cold Steel #5f82b9 · Sunshine #f0c832 · Off-white #f0f0f0

const HeroSection = () => {
  const [activeProduct, setActiveProduct] = useState(null);

  return (
    <section className="hero-section">
      {/* grade de quadrados removida */}

      <div className="hero-content">
        <img className="hero-logo" src="/images/logonavbar.png" alt="Logo" />

        <div className="hero-title-block">
          {/* Label — Cold Steel */}
          <p style={{
            color: '#5f82b9',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '.4em',
            textTransform: 'uppercase',
            margin: '0 0 12px',
          }}>
            Nossos Produtos
          </p>
          {/* Título — Off-white */}
          <h2 style={{
            color: '#f0f0f0',
            fontSize: 44,
            fontWeight: 800,
            margin: '0 0 16px',
            letterSpacing: '-.02em',
          }}>
            Soluções em Vidro
          </h2>
          {/* Linha decorativa — Sunshine */}
          <div style={{
            width: 48,
            height: 2,
            background: '#f0c832',
            margin: '0 auto 14px',
            borderRadius: 2,
          }} />
          <p style={{ color: 'rgba(240,240,240,.45)', fontSize: 12, margin: 0 }}>
            Deslize e interaja com nosso catálogo
          </p>
        </div>
      </div>

      <div className="carousel-wrapper">
        <ArcCarousel items={products} onCardTap={setActiveProduct} />
      </div>

      {activeProduct && (
        <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
      )}
    </section>
  );
};

export default HeroSection;