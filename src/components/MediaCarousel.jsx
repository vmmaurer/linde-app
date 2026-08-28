import React, { useEffect, useRef, useState } from 'react'
import { warmNeighbors } from '../utils/preloadAssets'

// ── Carrossel de mídia (vídeo + fotos) usado dentro dos pop-ups de card ──
// `onIndexChange` avisa o pop-up qual mídia está na tela — é o que permite
// ao ProductModal trocar a legenda (ex.: "Refletivo Cinza") junto com a foto.
export default function MediaCarousel({ media, height = '48vh', minHeight = 340, onIndexChange }) {
  const [index, setIndex] = useState(0)
  const startX = useRef(null)
  const startY = useRef(null)
  const isSwiping = useRef(false)
  const count = media.length

  // Decodifica o slide anterior e o próximo enquanto o atual está parado na
  // tela. Assim a seta (ou o swipe) troca a foto no mesmo frame do toque, em
  // vez de mostrar o quadro vazio enquanto o Chromium decodifica.
  useEffect(() => {
    if (count < 2) return
    const around = [index + 1, index - 1].map((i) => media[((i % count) + count) % count])
    warmNeighbors(around.filter((m) => m && m.type === 'image').map((m) => m.src))
  }, [index, media, count])

  const go = (i) => {
    const alvo = ((i % count) + count) % count
    setIndex(alvo)
    onIndexChange?.(alvo)
  }
  const next = () => go(index + 1)
  const prev = () => go(index - 1)

  // Deslize (swipe) — restrito à própria área da mídia (este container),
  // sem interferir nas setas/dots (que ficam por cima e usam stopPropagation).
  const onPointerDown = (e) => {
    startX.current = e.clientX
    startY.current = e.clientY
    isSwiping.current = true
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch (_) {}
  }
  const onPointerMove = (e) => {
    if (!isSwiping.current || startX.current === null) return
    const deltaX = e.clientX - startX.current
    const deltaY = e.clientY - (startY.current ?? e.clientY)
    // Só assume o gesto como horizontal (impedindo o scroll nativo de "puxar"
    // a página) quando o movimento lateral já é claramente maior que o vertical.
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) e.preventDefault()
  }
  const onPointerUp = (e) => {
    if (!isSwiping.current || startX.current === null) {
      isSwiping.current = false
      return
    }
    const delta = e.clientX - startX.current
    if (Math.abs(delta) > 40) {
      if (delta < 0) next()
      else prev()
    }
    isSwiping.current = false
    startX.current = null
    startY.current = null
  }
  const onPointerCancel = () => {
    isSwiping.current = false
    startX.current = null
    startY.current = null
  }

  const item = media[index]

  return (
    <div
      className="relative w-full flex-shrink-0 overflow-hidden"
      style={{ height, minHeight, background: '#0b1426', touchAction: 'pan-y' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {item.type === 'video' ? (
        <video
          key={item.src}
          src={item.src}
          className="w-full h-full"
          style={{ objectFit: 'cover', objectPosition: item.position || 'center' }}
          autoPlay
          muted
          playsInline
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
        />
      ) : (
        <img
          key={item.src}
          src={item.src}
          alt=""
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          className="w-full h-full object-cover"
          style={{ objectPosition: item.position || 'center' }}
        />
      )}

      {/* Selo de destaque — só as mídias que trazem `badge` mostram algo.
          A key força a animação de entrada a repetir a cada vez que a foto
          volta a aparecer no carrossel. */}
      {item.badge && (
        <div key={`selo-${item.src}`} className="media-selo" aria-label={item.badge}>
          <span className="media-selo__brilho" aria-hidden />
          <svg width="17" height="17" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, zIndex: 1 }}>
            <path d="M9 1.6l1.9 4.3 4.7.5-3.5 3.2 1 4.6L9 11.9l-4.1 2.3 1-4.6L2.4 6.4l4.7-.5z"
              stroke="#f0c832" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <span className="media-selo__txt">{item.badge}</span>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-950/60 to-transparent pointer-events-none" />

      {count > 1 && (
        <>
          <button
            onPointerDown={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
            style={{
              width: 64,
              height: 64,
              background: 'rgba(35,60,100,0.65)',
              border: '2.5px solid rgba(240,200,50,0.6)',
              boxShadow: '0 10px 36px rgba(0,0,0,0.4), 0 0 28px rgba(240,200,50,0.22), inset 0 1px 1px rgba(255,255,255,0.15)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              zIndex: 2,
            }}
            aria-label="Anterior"
          >
            <svg width="30" height="30" viewBox="0 0 20 20" fill="none">
              <path d="M13 4L7 10L13 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onPointerDown={(e) => { e.stopPropagation(); next() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
            style={{
              width: 64,
              height: 64,
              background: 'rgba(35,60,100,0.65)',
              border: '2.5px solid rgba(240,200,50,0.6)',
              boxShadow: '0 10px 36px rgba(0,0,0,0.4), 0 0 28px rgba(240,200,50,0.22), inset 0 1px 1px rgba(255,255,255,0.15)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              zIndex: 2,
            }}
            aria-label="Próximo"
          >
            <svg width="30" height="30" viewBox="0 0 20 20" fill="none">
              <path d="M7 4L13 10L7 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2" style={{ zIndex: 2 }}>
            {media.map((_, i) => (
              <button
                key={i}
                onPointerDown={(e) => { e.stopPropagation(); go(i) }}
                style={{
                  width: i === index ? 22 : 8, height: 8, borderRadius: 4,
                  background: i === index ? '#75c2ff' : 'rgba(255,255,255,0.4)',
                  border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s ease',
                }}
                aria-label={`Mídia ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      <style>{`
        /* ── Selo de destaque no topo da mídia ── */
        .media-selo {
          position: absolute;
          top: 20px;
          left: 50%;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 11px 24px;
          border-radius: 99rem;
          overflow: hidden;
          pointer-events: none;
          white-space: nowrap;
          color: #f0c832;
          background: linear-gradient(150deg, rgba(9,17,32,0.9) 0%, rgba(6,12,24,0.92) 100%);
          border: 2px solid rgba(240,200,50,0.85);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5),
                      0 0 28px rgba(240,200,50,0.32),
                      inset 0 1px 0 rgba(255,255,255,0.12);
          backdrop-filter: blur(14px) saturate(160%);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
          animation: seloEntra 0.6s cubic-bezier(0.22,1,0.36,1) 0.12s both;
        }
        .media-selo__txt {
          position: relative;
          z-index: 1;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: .16em;
          text-transform: uppercase;
          text-shadow: 0 0 14px rgba(240,200,50,0.5);
        }
        /* reflexo que atravessa o selo de tempos em tempos */
        .media-selo__brilho {
          position: absolute;
          top: 0; bottom: 0; left: -45%;
          width: 38%;
          background: linear-gradient(100deg,
                      rgba(255,255,255,0) 0%,
                      rgba(255,242,190,0.34) 50%,
                      rgba(255,255,255,0) 100%);
          animation: seloBrilho 3.8s ease-in-out infinite 0.9s;
        }
        @keyframes seloEntra {
          from { opacity: 0; transform: translateX(-50%) translateY(-16px) scale(0.94); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes seloBrilho {
          0%, 52%   { transform: translateX(0) skewX(-16deg); }
          82%, 100% { transform: translateX(430%) skewX(-16deg); }
        }
      `}</style>
    </div>
  )
}
