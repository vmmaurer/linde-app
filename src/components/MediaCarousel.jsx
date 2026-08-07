import React, { useRef, useState } from 'react'

// ── Carrossel de mídia (vídeo + fotos) usado dentro dos pop-ups de card ──
export default function MediaCarousel({ media, height = '48vh', minHeight = 340 }) {
  const [index, setIndex] = useState(0)
  const startX = useRef(null)
  const startY = useRef(null)
  const isSwiping = useRef(false)
  const count = media.length

  const go = (i) => setIndex(((i % count) + count) % count)
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
          style={{ objectFit: 'cover', objectPosition: 'center' }}
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
        />
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
    </div>
  )
}
