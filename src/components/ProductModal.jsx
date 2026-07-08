import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// ── Carrossel de mídia (vídeo + fotos) dentro do card ──
function MediaCarousel({ media }) {
  const [index, setIndex] = useState(0)
  const startX = useRef(null)
  const count = media.length

  const go = (i) => setIndex(((i % count) + count) % count)
  const next = () => go(index + 1)
  const prev = () => go(index - 1)

  const onPointerDown = (e) => { startX.current = e.clientX }
  const onPointerUp = (e) => {
    if (startX.current === null) return
    const delta = e.clientX - startX.current
    if (Math.abs(delta) > 40) {
      if (delta < 0) next()
      else prev()
    }
    startX.current = null
  }

  const item = media[index]

  return (
    <div
      className="relative w-full flex-shrink-0 overflow-hidden"
      style={{ height: '48vh', minHeight: '340px', background: '#0b1426' }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {item.type === 'video' ? (
        <video
          key={item.src}
          src={item.src}
          className="w-full h-full"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <img
          key={item.src}
          src={item.src}
          alt=""
          className="w-full h-full object-cover"
        />
      )}

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-950/60 to-transparent pointer-events-none" />

      {count > 1 && (
        <>
          <button
            onPointerDown={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
            style={{ width: 48, height: 48, background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.25)', zIndex: 2 }}
            aria-label="Anterior"
          >
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M13 4L7 10L13 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onPointerDown={(e) => { e.stopPropagation(); next() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
            style={{ width: 48, height: 48, background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.25)', zIndex: 2 }}
            aria-label="Próximo"
          >
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
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

export default function ProductModal({ product, onClose }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    window.dispatchEvent(new CustomEvent('modal-open'))
    return () => {
      window.removeEventListener('keydown', handleKey)
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

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ animation: 'fadeIn 0.3s ease forwards', paddingBottom: '160px', paddingTop: '24px' }}
    >
      <div
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-xl"
        onPointerDown={onClose}
        style={{ animation: 'fadeIn 0.3s ease forwards' }}
      />

      <div
        className="relative w-full max-w-3xl rounded-3xl shadow-glass-lg flex flex-col"
        style={{
          background: 'linear-gradient(155deg, rgba(114, 119, 136, 0.98) 0%, rgba(121, 127, 150, 0.99) 100%)',
          border: '1px solid rgba(255,255,255,0.15)',
          animation: 'modalScale 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
          maxHeight: '82vh',
          overflow: 'hidden',
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-5 right-5 z-10 touch-target flex items-center justify-center w-14 h-14 rounded-full"
          style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.2)' }}
          onPointerDown={onClose}
          aria-label="Fechar"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 4L18 18M18 4L4 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '82vh' }}>
          <MediaCarousel media={mediaList} />

          <div className="p-8 md:p-10 flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-glass-300 text-sm font-medium tracking-widest uppercase mb-2">
                  {product.subtitle}
                </p>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
                  {product.title}
                </h2>
              </div>

              {/* Logo da marca — só aparece se o produto tiver o campo brandLogo */}
              {product.brandLogo && (
                <img
                  src={product.brandLogo}
                  alt=""
                  className="flex-shrink-0 object-contain"
                  style={{ height: '64px', width: 'auto', maxWidth: '160px' }}
                />
              )}
            </div>

            <p className="text-white/75 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Applications — mesmo estilo de caixa dos antigos Diferenciais */}
            <div>
              <h3 className="text-glass-300 text-xs font-semibold tracking-widest uppercase mb-3">
                Aplicações
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {product.applications.map((app, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {/* Ícone de marcador (localização) — combina com "onde aplicar" */}
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
                      <path d="M9 1.5c-2.9 0-5.25 2.35-5.25 5.25 0 3.94 5.25 9.75 5.25 9.75s5.25-5.81 5.25-9.75C14.25 3.85 11.9 1.5 9 1.5z" stroke="#75c2ff" strokeWidth="1.6" strokeLinejoin="round"/>
                      <circle cx="9" cy="6.75" r="1.9" stroke="#75c2ff" strokeWidth="1.6"/>
                    </svg>
                    <span className="text-white/85 text-sm">{app}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seção Diferenciais removida conforme solicitado */}
          </div>
        </div>
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