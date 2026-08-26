import React, { useState, useEffect, useRef, useCallback } from 'react'

// ── Paleta: Sapphire #233c64 · Cold Steel #5f829b · Sunshine #f0c832

export default function ArcCarousel({ items, onCardTap, paused = false }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isPortraitKiosk, setIsPortraitKiosk] = useState(false)

  const dragOffsetRef   = useRef(0)
  const touchStartX     = useRef(null)
  const touchStartY     = useRef(null)
  const autoRotateTimer = useRef(null)
  const resumeTimer     = useRef(null)
  const animTimer       = useRef(null)
  const dragStartX      = useRef(0)
  const containerRef    = useRef(null)
  const count = items.length

  useEffect(() => {
    const checkScreen = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const isPortrait = h > w
      setIsMobile(w < 768 && !isPortrait)
      setIsPortraitKiosk(isPortrait && w >= 600)
    }
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  const startAutoRotate = useCallback(() => {
    clearInterval(autoRotateTimer.current)
    autoRotateTimer.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % count)
    }, 6000)
  }, [count])

  const pauseAndScheduleResume = useCallback(() => {
    clearInterval(autoRotateTimer.current)
    clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => startAutoRotate(), 3500)
  }, [startAutoRotate])

  useEffect(() => {
    clearInterval(autoRotateTimer.current)
    clearTimeout(resumeTimer.current)

    if (!paused) startAutoRotate()

    return () => { clearInterval(autoRotateTimer.current); clearTimeout(resumeTimer.current) }
  }, [paused, startAutoRotate])

  const goTo = useCallback((idx) => {
    if (isAnimating) return
    setCurrentIndex(((idx % count) + count) % count)
    setIsAnimating(true)
    clearTimeout(animTimer.current)
    animTimer.current = setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, count])

  // Garante que nenhum temporizador sobreviva à troca de tela do totem.
  useEffect(() => () => {
    clearTimeout(animTimer.current)
    clearInterval(autoRotateTimer.current)
    clearTimeout(resumeTimer.current)
  }, [])

  const goNext = useCallback(() => { goTo(currentIndex + 1); pauseAndScheduleResume() }, [currentIndex, goTo, pauseAndScheduleResume])
  const goPrev = useCallback(() => { goTo(currentIndex - 1); pauseAndScheduleResume() }, [currentIndex, goTo, pauseAndScheduleResume])

  const handlePointerDown = (e) => {
    touchStartX.current = e.clientX
    touchStartY.current = e.clientY
    dragStartX.current  = e.clientX
    setIsDragging(true)
    pauseAndScheduleResume()
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const handlePointerMove = (e) => {
    if (!isDragging || touchStartX.current === null) return
    const delta  = e.clientX - dragStartX.current
    const deltaY = Math.abs(e.clientY - (touchStartY.current || e.clientY))
    const deltaX = Math.abs(delta)
    setDragOffset(delta)
    dragOffsetRef.current = delta
    if (deltaX > deltaY && deltaX > 15) e.preventDefault()
  }
  const handlePointerUp = (e) => {
    if (!isDragging) return
    const delta       = e.clientX - (touchStartX.current || e.clientX)
    const cardsToMove = Math.max(1, Math.round(Math.abs(delta) / 350))
    if (Math.abs(delta) > 30) {
      if (delta < 0) goTo(currentIndex + cardsToMove)
      else           goTo(currentIndex - cardsToMove)
    }
    setIsDragging(false)
    setDragOffset(0)
    dragOffsetRef.current = 0
    touchStartX.current   = null
  }
  const handlePointerCancel = () => {
    setIsDragging(false); setDragOffset(0); touchStartX.current = null
  }

  const CARD_W      = isMobile ? 320 : isPortraitKiosk ? 640 : 360
  const CARD_H      = isMobile ? 460 : isPortraitKiosk ? 920 : 520
  const ARC_RADIUS  = isPortraitKiosk ? 1150 : 700
  const CARD_ANGLE  = isPortraitKiosk ? 28 : 35

  const getCardStyle = (index) => {
    let diff = index - currentIndex
    if (diff >  count / 2) diff -= count
    if (diff < -count / 2) diff += count
    const dragAngle = (dragOffset / 400) * CARD_ANGLE
    const angle     = diff * CARD_ANGLE + dragAngle
    const visible   = Math.abs(diff) <= 3
    const rad = (angle * Math.PI) / 180
    const x   = ARC_RADIUS * Math.sin(rad)
    const z   = ARC_RADIUS * (Math.cos(rad) - 1)
    const scale   = 1 - Math.abs(angle) * 0.0025
    const opacity = Math.abs(diff) > 2.5 ? 0 : 1 - Math.abs(angle) * 0.009
    const zIndex  = 100 - Math.abs(Math.round(diff))
    return {
      transform: `translate3d(${x}px, 0, ${z}px) scale(${Math.max(scale, 0.6)})`,
      opacity: Math.max(opacity, 0),
      zIndex,
      pointerEvents: visible ? 'auto' : 'none',
      transition: isDragging ? 'none' : 'transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease',
      // Só os cards da janela visível ganham camada de GPU. `visible` (|diff|<=3)
      // é uma faixa MAIOR que a de opacidade (que zera em |diff|>2.5), então a
      // camada já existe antes do card começar a aparecer — sem engasgo.
      // Antes todos os cards ficavam promovidos o tempo todo, segurando VRAM à toa.
      willChange: visible ? 'transform, opacity' : 'auto',
    }
  }

  return (
    <div className="relative w-full select-none" style={{ height: `${CARD_H + 120}px` }}>
      <div
        ref={containerRef}
        className="relative w-full h-full"
        style={{
          perspective: '1200px', perspectiveOrigin: '50% 40%',
          touchAction: 'pan-y', WebkitTouchCallout: 'none',
          paddingTop: '40px', paddingBottom: '40px',
          marginTop: '-40px', marginBottom: '-40px',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          {items.map((item, idx) => {
            const isActive    = idx === currentIndex
            const cardStyle   = getCardStyle(idx)

            return (
              <div
                key={item.id}
                className="absolute rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  width: `${CARD_W}px`,
                  height: `${CARD_H}px`,
                  /* Card ativo: borda Sunshine + sombra dourada suave */
                  boxShadow: isActive
                    ? '0 30px 80px rgba(0,0,0,0.65), 0 0 40px rgba(240,200,50,0.18)'
                    : '0 16px 40px rgba(0,0,0,0.45)',
                  border: isActive
                    ? '1.5px solid rgba(240,200,50,0.55)'
                    : '1px solid rgba(95,130,155,0.25)',
                  ...cardStyle,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (Math.abs(dragOffsetRef.current) > 10) return
                  if (idx === currentIndex) onCardTap(item)
                  else { goTo(idx); pauseAndScheduleResume() }
                }}
              >
                {/* Background image */}
                <img src={item.image} alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover" draggable={false} onDragStart={(e) => e.preventDefault()} />

                {/* Gradient overlay — Sapphire */}
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to top, rgba(4,11,25,0.96) 0%, rgba(35,60,100,0.45) 50%, rgba(35,60,100,0.08) 100%)',
                }} />

                {/* Glass shine top-left */}
                <div className="absolute top-0 left-0 w-2/3 h-1/3 rounded-br-full" style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {/* Tag — Cold Steel */}
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-xs font-medium tracking-wider uppercase"
                    style={{
                      background: 'rgba(95,130,155,0.22)',
                      border: '1px solid rgba(95,130,155,0.45)',
                      color: '#c8dde8',
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5f829b' }} />
                    Soluções em Vidro
                  </div>

                  <h3 className="text-white font-display font-bold leading-tight mb-1"
                    style={{ fontSize: isPortraitKiosk ? '2.5rem' : '1.5rem' }}>
                    {item.title}
                  </h3>
                  <p className="font-medium mb-4"
                    style={{ color: 'rgba(240,240,240,0.6)', fontSize: isPortraitKiosk ? '1.25rem' : '0.875rem' }}>
                    {item.subtitle}
                  </p>

                  {/* Tap indicator — Sunshine */}
                  {isActive && (
                    <div className="flex items-center gap-2 font-medium"
                      style={{
                        color: '#f0c832',
                        animation: 'pulseOpacity 2.5s ease-in-out infinite',
                        fontSize: isPortraitKiosk ? '1rem' : '0.75rem',
                      }}
                    >
                      <svg width={isPortraitKiosk ? 22 : 16} height={isPortraitKiosk ? 22 : 16}
                        viewBox="0 0 16 16" fill="none">
                        <path d="M8 2V8L11 11" stroke="#f0c832" strokeWidth="1.5" strokeLinecap="round"/>
                        <circle cx="8" cy="8" r="6.5" stroke="#f0c832" strokeWidth="1.5" opacity="0.5"/>
                      </svg>
                      Toque para saber mais
                    </div>
                  )}
                </div>

                {/* Active border glow — Sunshine */}
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
                    boxShadow: 'inset 0 0 0 1.5px rgba(240,200,50,0.5)',
                  }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Nav arrows — Cold Steel */}
      {[['left-6', goPrev, 'M13 4L7 10L13 16', 'Anterior'], ['right-6', goNext, 'M7 4L13 10L7 16', 'Próximo']].map(([pos, fn, path, label]) => (
        <button
          key={label}
          className={`absolute ${pos} top-1/2 -translate-y-1/2 z-20 touch-target flex items-center justify-center rounded-full`}
          style={{
            background: 'rgba(35,60,100,0.5)',
            border: '1px solid rgba(95,130,155,0.4)',
            width: isPortraitKiosk ? 72 : 56,
            height: isPortraitKiosk ? 72 : 56,
          }}
          onPointerDown={(e) => { e.stopPropagation(); fn() }}
          aria-label={label}
        >
          <svg width={isPortraitKiosk ? 28 : 20} height={isPortraitKiosk ? 28 : 20} viewBox="0 0 20 20" fill="none">
            <path d={path} stroke="#f0f0f0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ))}

      {/* Dot indicators — Sunshine para ativo */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            className="touch-target flex items-center justify-center"
            style={{ minWidth: 28, minHeight: 28 }}
            onPointerDown={(e) => { e.stopPropagation(); goTo(idx); pauseAndScheduleResume() }}
            aria-label={`Slide ${idx + 1}`}
          >
            <div style={{
              width:      idx === currentIndex ? 24 : 8,
              height:     8,
              borderRadius: 4,
              background: idx === currentIndex ? '#f0c832' : 'rgba(95,130,155,0.4)',
              transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
            }} />
          </button>
        ))}
      </div>

      <style>{`
        @keyframes pulseOpacity {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
      `}</style>
    </div>
  )
}
