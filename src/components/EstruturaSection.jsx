import React from 'react';
import './HeroSection.css';

// ── Paleta: Sapphire #233c64 · Cold Steel #5f829b · Sunshine #f0c832 · Off-white #f0f0f0

const features = [
  {
    tag: 'Fábrica',
    title: 'Sede Industrial',
    desc: 'Planta própria estruturada para produzir com agilidade em grande escala.',
    image: '/images/empresa-1.jpg',
  },
  {
    tag: 'Produção',
    title: 'Parque de Máquinas',
    desc: 'Equipamentos de ponta para corte, têmpera e beneficiamento do vidro.',
    image: '/images/IMG_6240.JPG',
  },
  {
    tag: 'Logística',
    title: 'Estoque Próprio',
    desc: 'Matéria-prima sempre disponível, pronta para entrar em produção.',
    image: '/images/ESTOQUE.JPG',
  },
  {
    tag: 'Entrega',
    title: 'Frota Própria',
    desc: 'Veículos próprios levando qualidade a toda a região.',
    image: '/images/FROTA.jpg',
  },
];

function FeatureCard({ index, tag, title, desc, image }) {
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 22,
        overflow: 'hidden',
        border: '1px solid rgba(95,130,155,0.3)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
        background: '#0b1830',
      }}
    >
      <img
        src={image}
        alt={title}
        draggable={false}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(4,11,25,0.94) 0%, rgba(35,60,100,0.28) 55%, rgba(4,11,25,0.05) 100%)',
      }} />

      {/* Número — mesmo padrão dos marcadores da Galeria */}
      <span style={{
        position: 'absolute', top: 14, left: 16,
        color: '#f0c832', fontSize: 'clamp(20px, 2.6vw, 30px)', fontWeight: 800,
        textShadow: '0 2px 10px rgba(0,0,0,0.85)',
      }}>
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Conteúdo — mesmo padrão de tag do ArcCarousel */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(14px, 2.4vw, 24px)' }}>
        <div
          className="inline-flex items-center gap-1.5 rounded-full mb-2 font-medium tracking-wider uppercase"
          style={{
            background: 'rgba(95,130,155,0.22)',
            border: '1px solid rgba(95,130,155,0.45)',
            color: '#c8dde8',
            fontSize: 'clamp(9px, 1vw, 11px)',
            padding: '5px 12px',
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5f829b', flexShrink: 0 }} />
          {tag}
        </div>
        <h3 style={{
          color: '#fff', fontWeight: 700, lineHeight: 1.15, margin: '0 0 6px',
          fontSize: 'clamp(1.05rem, 2.4vw, 1.7rem)',
        }}>
          {title}
        </h3>
        <p style={{
          color: 'rgba(240,240,240,0.62)', margin: 0, lineHeight: 1.4,
          fontSize: 'clamp(0.75rem, 1.3vw, 0.95rem)',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {desc}
        </p>
      </div>
    </div>
  );
}

const EstruturaSection = () => {
  return (
    <section
      className="hero-section estrutura-fullheight"
      style={{
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        overflow: 'hidden',
        padding: 0,
        backgroundImage:
          'linear-gradient(180deg, rgba(4,11,25,0.55) 0%, rgba(35,60,100,0.30) 45%, rgba(4,11,25,0.75) 100%), url(/images/FUNDO-PAGINA-ESTRUTURA1.png)',
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
        .estrutura-fullheight {
          height: 100vh;
          height: 100dvh;
        }
      `}</style>

      {/* Fades laterais — mesmo padrão da tela História */}
      {[['left', '90deg'], ['right', '270deg']].map(([side, deg]) => (
        <div
          key={side}
          style={{
            position: 'absolute', top: 0, bottom: 0, [side]: 0, width: 80,
            background: `linear-gradient(${deg}, rgba(4,11,25,0.85) 0%, transparent 100%)`,
            pointerEvents: 'none', zIndex: 20,
          }}
        />
      ))}

      <div style={{ position: 'relative', zIndex: 2, width: '100%', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>

        {/* Cabeçalho — mesmo padrão da tela História (alturas em clamp()
            para sobrar espaço pra grade em telas curtas/paisagem) */}
        <div style={{ textAlign: 'center', paddingTop: 'clamp(14px, 4vh, 57px)', marginBottom: 'clamp(8px, 2vh, 20px)', flexShrink: 0 }}>
          <img src="/images/logonavbar.png" alt="Linde Vidros"
            style={{ height: 'clamp(90px, 11vh, 150px)', width: 'auto', objectFit: 'contain', display: 'inline-block', marginBottom: 'clamp(8px, 1.6vh, 18px)' }} />
          <p style={{ color: '#5f829b', fontSize: 11, fontWeight: 700, letterSpacing: '.4em', textTransform: 'uppercase', margin: '0 0 10px' }}>
            Como Trabalhamos
          </p>
          <h2 style={{ color: '#f0f0f0', fontSize: 'clamp(28px, 4vh, 40px)', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-.02em' }}>
            Nossa Estrutura
          </h2>
          <div style={{ width: 48, height: 2, background: '#f0c832', margin: '0 auto 12px', borderRadius: 2 }} />
          <p style={{ color: 'rgba(240,240,240,.45)', fontSize: 13, margin: 0 }}>
            Da fábrica à entrega: os bastidores de cada vidro Linde
          </p>
        </div>

        {/* Grade de destaques */}
        <div style={{
          flex: 1, minHeight: 0, width: '100%', maxWidth: 1400, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)',
          gap: 18, padding: '0 24px 240px', boxSizing: 'border-box',
        }}>
          {features.map((f, i) => (
            <FeatureCard key={f.title} index={i} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EstruturaSection;
