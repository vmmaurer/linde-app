import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import MediaCarousel from './MediaCarousel'

// ── Pop-up de detalhe dos cards da aba Estrutura ──
// Mesma "casca" (overlay + botão Fechar centralizado) criada para o
// ProductModal, com uma nota de cabeçalho no topo (tag + título, igual
// ao que já aparece no card) e um carrossel de mídia maior em destaque.
export default function EstruturaModal({ feature, onClose }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    window.addEventListener('force-close-modal', onClose)
    document.body.style.overflow = 'hidden'
    window.dispatchEvent(new CustomEvent('modal-open'))
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('force-close-modal', onClose)
      document.body.style.overflow = ''
      window.dispatchEvent(new CustomEvent('modal-close'))
    }
  }, [onClose])

  if (!feature) return null

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex flex-col items-center p-6"
      style={{ animation: 'fadeIn 0.3s ease forwards' }}
    >
      <div
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-xl"
        onPointerDown={onClose}
        style={{ animation: 'fadeIn 0.3s ease forwards' }}
      />

      {/* Espaçador superior — junto com o inferior, mantém o card
          centralizado e reserva espaço simétrico para o botão fechar */}
      <div style={{ flex: '1 1 0%', minHeight: 0 }} />

      <div
        className="relative w-full max-w-4xl rounded-3xl shadow-glass-lg flex flex-col"
        style={{
          background: 'linear-gradient(155deg, rgba(114, 119, 136, 0.98) 0%, rgba(121, 127, 150, 0.99) 100%)',
          border: '1px solid rgba(255,255,255,0.15)',
          animation: 'modalScale 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
          maxHeight: '82vh',
          flexShrink: 0,
          overflow: 'hidden',
          zIndex: 1,
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '82vh' }}>

          {/* Nota de cabeçalho — mesma info do card (tag + título) */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.14)',
            background: 'rgba(4,11,25,0.18)',
          }}>
            <div>
              <div
                className="inline-flex items-center gap-1.5 rounded-full mb-2 font-medium tracking-wider uppercase"
                style={{
                  background: 'rgba(95,130,155,0.22)',
                  border: '1px solid rgba(95,130,155,0.45)',
                  color: '#c8dde8',
                  fontSize: 11,
                  padding: '5px 12px',
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5f829b', flexShrink: 0 }} />
                {feature.tag}
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
                {feature.title}
              </h2>
            </div>
          </div>

          <MediaCarousel media={feature.media} height="52vh" minHeight={380} />

          <div className="p-8 md:p-10 flex flex-col gap-6">
            <p className="text-white/75 text-lg leading-relaxed">
              {feature.longDesc}
            </p>

            <div>
              <h3 className="text-glass-300 text-xs font-semibold tracking-widest uppercase mb-3">
                Destaques
              </h3>
              <div className="flex flex-col gap-3">
                {feature.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
                      <path d="M9 1.5c-2.9 0-5.25 2.35-5.25 5.25 0 3.94 5.25 9.75 5.25 9.75s5.25-5.81 5.25-9.75C14.25 3.85 11.9 1.5 9 1.5z" stroke="#75c2ff" strokeWidth="1.6" strokeLinejoin="round"/>
                      <circle cx="9" cy="6.75" r="1.9" stroke="#75c2ff" strokeWidth="1.6"/>
                    </svg>
                    <span className="text-white/85 text-base">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Espaçador inferior — centraliza o botão fechar entre o fim
          do card e o fim da tela (mesmo flex-grow do espaçador superior) */}
      <div className="w-full flex items-center justify-center" style={{ flex: '1 1 0%', minHeight: 0, zIndex: 1 }}>
        <button
          onPointerDown={onClose}
          aria-label="Fechar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '30px 68px',
            borderRadius: '99rem',
            background: 'rgba(35, 60, 100, 0.65)',
            border: '2.5px solid rgba(240,200,50,0.6)',
            boxShadow: '0 10px 36px rgba(0,0,0,0.4), 0 0 28px rgba(240,200,50,0.22), inset 0 1px 1px rgba(255,255,255,0.15)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            color: '#f0f0f0',
            cursor: 'pointer',
          }}
        >
          <svg width="42" height="42" viewBox="0 0 22 22" fill="none">
            <path d="M4 4L18 18M18 4L4 18" stroke="#f0f0f0" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 26, fontWeight: 500, letterSpacing: '0.3px' }}>Fechar</span>
        </button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalScale {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    modalRoot
  )
}
