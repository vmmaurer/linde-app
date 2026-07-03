import React, { useState, useEffect, useRef } from 'react'
import { galleryImages } from '../data/products'

// ── Paleta: Sapphire #233c64 · Cold Steel #5f829b · Sunshine #f0c832

export default function Galeria() {
  const [selected, setSelected] = useState(0)
  const [loadedSet, setLoadedSet] = useState(() => new Set([0]))
  const [bigLoaded, setBigLoaded] = useState(false)
  const current = galleryImages[selected]

  useEffect(() => {
    let i = 1
    const timer = setInterval(() => {
      setLoadedSet(prev => { const next = new Set(prev); next.add(i); return next })
      i++
      if (i >= galleryImages.length) clearInterval(timer)
    }, 250)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setBigLoaded(false)
    setLoadedSet(prev => {
      if (prev.has(selected)) return prev
      const next = new Set(prev); next.add(selected); return next
    })
  }, [selected])

  return (
    <section
      className="relative px-6 md:px-12"
      style={{
        /* Fundo Sapphire profundo */
        background: 'linear-gradient(180deg, #040b19 0%, #0f1e38 50%, #040b19 100%)',
        paddingTop: '2cm',
        paddingBottom: '220px',
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/images/logonavbar.png" alt="Linde Vidros"
            style={{ height: '260px', width: 'auto', objectFit: 'contain', display: 'inline-block' }} />
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-display text-5xl font-bold text-white mb-4">Maquinários</h2>
          {/* Sunshine na linha decorativa */}
          <div style={{ height: 2, width: 64, background: '#f0c832', margin: '0 auto 16px', borderRadius: 2 }} />
          <p style={{ color: 'rgba(240,240,240,0.5)' }} className="text-lg">
            Conheça algumas das nossas máquinas
          </p>
        </div>

        {/* Roleta de miniaturas */}
        <div style={{
          display: 'flex', gap: '14px',
          overflowX: 'auto', padding: '4px 4px 16px',
          marginBottom: '24px', scrollbarWidth: 'thin',
        }}>
          {galleryImages.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelected(i)}
              style={{
                flex: '0 0 auto', width: '110px', height: '82px',
                borderRadius: '14px', overflow: 'hidden', cursor: 'pointer',
                padding: 0, position: 'relative',
                /* Sapphire como placeholder */
                background: '#1a2e50',
                /* Sunshine na borda ativa, transparente nas inativas */
                border: i === selected ? '3px solid #f0c832' : '3px solid transparent',
                boxShadow: i === selected
                  ? '0 0 18px rgba(240,200,50,0.45)'
                  : '0 4px 12px rgba(0,0,0,0.4)',
                transition: 'all 0.25s ease',
                transform: i === selected ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {loadedSet.has(i) ? (
                <img src={img.src} alt={img.alt} loading="lazy" decoding="async" draggable={false}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    opacity: i === selected ? 1 : 0.6, transition: 'opacity 0.25s ease',
                  }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(95,130,155,0.5)', fontSize: 12,
                }}>···</div>
              )}
              {/* Número — Sunshine */}
              <span style={{
                position: 'absolute', top: '6px', left: '8px',
                color: i === selected ? '#f0c832' : '#f0f0f0',
                fontSize: '16px', fontWeight: 800,
                textShadow: '0 2px 6px rgba(0,0,0,0.9)',
                pointerEvents: 'none',
              }}>
                {i + 1}
              </span>
            </button>
          ))}
        </div>

        {/* Imagem grande */}
        <div style={{
          position: 'relative', width: '100%', height: '52vh',
          borderRadius: '24px', overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
          /* Cold Steel na borda */
          border: '1px solid rgba(95,130,155,0.25)',
          background: '#1a2e50',
        }}>
          {!bigLoaded && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(95,130,155,0.5)', fontSize: 14, letterSpacing: '0.1em',
            }}>
              Carregando…
            </div>
          )}
          <img
            key={current.id} src={current.src} alt={current.alt}
            decoding="async" draggable={false}
            onLoad={() => setBigLoaded(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              opacity: bigLoaded ? 1 : 0, transition: 'opacity 0.4s ease',
            }}
          />
        </div>

        {/* Caixa de texto */}
        <div style={{
          marginTop: '20px', padding: '24px 28px', borderRadius: '18px',
          /* Sapphire escuro */
          background: 'linear-gradient(145deg, rgba(26,46,80,0.95), rgba(15,30,56,0.95))',
          border: '1px solid rgba(95,130,155,0.2)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
        }}>
          {/* Sunshine no label */}
          <p style={{
            color: '#f0c832', fontSize: '13px', fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 8px',
          }}>
            Linde Vidros · Imagem {selected + 1}
          </p>
          <h3 style={{ color: '#f0f0f0', fontSize: '2rem', fontWeight: 700, margin: '0 0 12px', lineHeight: 1.2 }}>
            {current.alt}
          </h3>
          {current.desc && (
            <p style={{ color: 'rgba(240,240,240,0.7)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
              {current.desc}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}