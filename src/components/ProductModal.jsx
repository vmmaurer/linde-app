import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import MediaCarousel from './MediaCarousel'
import FichaTecnicaModal from './FichaTecnicaModal'
import { fichasTecnicas } from '../data/fichaTecnica'

export default function ProductModal({ product, onClose }) {
  const overlayRef = useRef(null)
  const [fichaAberta, setFichaAberta] = useState(false)
  const [mediaIndex, setMediaIndex] = useState(0)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
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

  if (!product) return null

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  let mediaList = product.media
  if (!mediaList || mediaList.length === 0) {
    mediaList = []
    if (product.modalVideo) mediaList.push({ type: 'video', src: product.modalVideo })
    if (product.modalImage) mediaList.push({ type: 'image', src: product.modalImage })
  }

  // Só os produtos com o campo `ficha` (hoje: Vidro Habitat) ganham o
  // botão que abre o pop-up com as tabelas de desempenho.
  const ficha = product.ficha ? fichasTecnicas[product.ficha] : null

  // Legenda da foto atual (ex.: "Refletivo Cinza"). Só as mídias que têm
  // `caption` mostram algo — a capa, por exemplo, não tem.
  const legenda = mediaList[mediaIndex]?.caption || null

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
        className="relative w-full max-w-3xl rounded-3xl shadow-glass-lg flex flex-col"
        style={{
          background: 'linear-gradient(155deg, rgba(114, 119, 136, 0.98) 0%, rgba(121, 127, 150, 0.99) 100%)',
          border: '1px solid rgba(255,255,255,0.15)',
          animation: 'modalScale 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
          maxHeight: '78vh',
          flexShrink: 0,
          overflow: 'hidden',
          zIndex: 1,
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '78vh' }}>
          <MediaCarousel media={mediaList} onIndexChange={setMediaIndex} />

          <div className="p-8 md:p-10 flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-glass-300 text-sm font-medium tracking-widest uppercase mb-2">
                  {product.subtitle}
                </p>
                <h2
                  className="font-display text-4xl md:text-5xl font-bold text-white leading-tight"
                  style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}
                >
                  <span>{product.title}</span>

                  {/* Legenda da foto — a key força o replay da animação
                      a cada troca de imagem no carrossel */}
                  {legenda && (
                    <span key={legenda} className="legenda-media">
                      <span className="legenda-media__barra" aria-hidden />
                      <span className="legenda-media__txt">{legenda}</span>
                    </span>
                  )}
                </h2>
              </div>

              {/* Logo da marca — só aparece se o produto tiver o campo brandLogo */}
              {product.brandLogo && (
                <img
                  src={product.brandLogo}
                  alt=""
                  className="flex-shrink-0 object-contain"
                  style={{ height: '64px', width: 'auto', maxWidth: '160px' }}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                />
              )}
            </div>

            <p className="text-white/75 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Applications — apenas ícone + texto, sem caixa clicável.
                Quando o produto tem ficha técnica, o botão dela ocupa a
                coluna da direita, alinhado à base da lista. */}
            <div className="flex items-end justify-between gap-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-glass-300 text-xs font-semibold tracking-widest uppercase mb-3">
                  {product.applicationsTitle || 'Aplicações'}
                </h3>
                <div className="flex flex-col gap-3">
                  {product.applications.map((app, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {/* Ícone de marcador (localização) */}
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
                        <path d="M9 1.5c-2.9 0-5.25 2.35-5.25 5.25 0 3.94 5.25 9.75 5.25 9.75s5.25-5.81 5.25-9.75C14.25 3.85 11.9 1.5 9 1.5z" stroke="#75c2ff" strokeWidth="1.6" strokeLinejoin="round"/>
                        <circle cx="9" cy="6.75" r="1.9" stroke="#75c2ff" strokeWidth="1.6"/>
                      </svg>
                      <span className="text-white/85 text-base">{app}</span>
                    </div>
                  ))}
                </div>
              </div>

              {ficha && (
                <button
                  onPointerDown={(e) => { e.stopPropagation(); setFichaAberta(true) }}
                  aria-label="Abrir ficha técnica"
                  className="ficha-btn"
                >
                  <span className="ficha-btn__glow" aria-hidden />
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
                    <path d="M11.5 2H5.5A1.5 1.5 0 0 0 4 3.5v13A1.5 1.5 0 0 0 5.5 18h9a1.5 1.5 0 0 0 1.5-1.5V6.5L11.5 2Z"
                      stroke="#f0c832" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M11.5 2v4.5H16" stroke="#f0c832" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M7 10.5h6M7 13.5h4" stroke="#f0c832" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="ficha-btn__label">Ficha Técnica</span>
                </button>
              )}
            </div>

            {/* Seção Diferenciais removida conforme solicitado */}
          </div>
        </div>
      </div>

      {/* Espaçador inferior — centraliza o botão fechar entre o fim
          do card e o fim da tela (mesmo flex-grow do espaçador superior).
          Com a ficha técnica aberta o botão some (só a opacidade, para não
          mexer no espaçamento) e quem fecha é o botão da ficha. */}
      <div
        className="w-full flex items-center justify-center"
        style={{
          flex: '1 1 0%',
          minHeight: 0,
          zIndex: 1,
          opacity: fichaAberta ? 0 : 1,
          pointerEvents: fichaAberta ? 'none' : 'auto',
          transition: 'opacity 0.25s ease',
        }}
      >
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

      {/* Pop-up da ficha técnica — abre por cima deste card */}
      {ficha && fichaAberta && (
        <FichaTecnicaModal ficha={ficha} onClose={() => setFichaAberta(false)} />
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalScale {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* ── Legenda da foto, ao lado do título ──
           Título fica branco; a linha do Habitat (Neutro/Refletivo + tom)
           entra em Sunshine (#f0c832). A troca é anunciada: a barra cresce,
           o texto chega desfocado da esquerda e dá um flash antes de assentar. */
        .legenda-media {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }
        .legenda-media__barra {
          width: 3px;
          height: 32px;
          border-radius: 2px;
          background: #f0c832;
          box-shadow: 0 0 16px rgba(240,200,50,0.65);
          animation: legendaBarra 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }
        .legenda-media__txt {
          font-size: 25px;
          font-weight: 800;
          letter-spacing: -0.005em;
          color: #f0c832;
          white-space: nowrap;
          animation: legendaTexto 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes legendaBarra {
          0%   { transform: scaleY(0);    opacity: 0; }
          55%  { transform: scaleY(1.28); opacity: 1; }
          100% { transform: scaleY(1);    opacity: 1; }
        }
        @keyframes legendaTexto {
          0%   { opacity: 0; transform: translateX(-14px); filter: blur(6px);
                 text-shadow: 0 0 28px rgba(240,200,50,0.95); }
          55%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0);
                 text-shadow: 0 0 0 rgba(240,200,50,0); }
        }

        /* ── Botão "Ficha Técnica" ──
           Preto fosco com borda Sunshine (#f0c832) em neon. O brilho
           respira devagar para chamar o toque sem competir com o card. */
        .ficha-btn {
          position: relative;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 11px;
          padding: 17px 26px;
          min-height: 58px;
          border-radius: 99rem;
          background: linear-gradient(160deg, rgba(16,18,24,0.95) 0%, rgba(8,10,14,0.97) 100%);
          border: 2px solid rgba(240,200,50,0.75);
          box-shadow: 0 8px 26px rgba(0,0,0,0.45),
                      0 0 18px rgba(240,200,50,0.25),
                      inset 0 1px 0 rgba(255,255,255,0.10);
          color: #ffffff;
          cursor: pointer;
          touch-action: manipulation;
          overflow: hidden;
          transition: transform 0.18s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.25s ease,
                      border-color 0.25s ease;
          animation: fichaBtnIn 0.5s cubic-bezier(0.22,1,0.36,1) 0.25s both;
        }
        .ficha-btn:active {
          transform: scale(0.955);
          border-color: rgba(240,200,50,1);
          box-shadow: 0 4px 14px rgba(0,0,0,0.5),
                      0 0 30px rgba(240,200,50,0.45),
                      inset 0 1px 0 rgba(255,255,255,0.12);
        }
        .ficha-btn__label {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: .13em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        /* Halo pulsante por trás da borda */
        .ficha-btn__glow {
          position: absolute;
          inset: -2px;
          border-radius: 99rem;
          border: 2px solid rgba(240,200,50,0.55);
          pointer-events: none;
          animation: fichaBtnPulse 2.8s ease-in-out infinite;
        }
        /* Reflexo que atravessa o botão de tempos em tempos */
        .ficha-btn::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          left: -50%;
          width: 45%;
          background: linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(240,200,50,0.16) 50%, rgba(255,255,255,0) 100%);
          pointer-events: none;
          animation: fichaBtnShine 4.6s ease-in-out infinite;
        }
        @keyframes fichaBtnIn {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fichaBtnPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%      { opacity: 0;    transform: scale(1.09); }
        }
        @keyframes fichaBtnShine {
          0%, 58%   { transform: translateX(0) skewX(-18deg); }
          86%, 100% { transform: translateX(380%) skewX(-18deg); }
        }
      `}</style>
    </div>,
    modalRoot
  )
}