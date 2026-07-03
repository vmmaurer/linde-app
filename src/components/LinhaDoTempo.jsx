import React, { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

// ── Paleta ──
// Sapphire Glass #233c64 · Cold Steel #5f829b · Sunshine #f0c832
// Midnight #323232 · Off-white #f0f0f0

const milestones = [
  { image: '/images/linde_1989.jpeg', year: '1989', desc: 'Fundação da Linde Vidros, iniciando uma trajetória de inovação e qualidade no setor vidreiro.' },
  { image: '/images/linde_1991.jpg',  year: '1991', desc: 'Em agosto de 1991 foi fundada uma filial na cidade de Rio Negro – PR para a distribuição em chapas de vidros em geral, atendendo outras regiões.' },
  { image: '/images/linde_1993.jpg',  year: '1993', desc: 'Nos últimos anos, a unidade de Rio Negro vem investindo em máquinas de última geração para melhor corte e acabamento.' },
  { image: '/images/linde_1995.jpg',  year: '1995', desc: 'No ano 2000 foi instalado um forno de tempera vertical.' },
  { image: '/images/linde_2004.jpg',  year: '2004', desc: 'A grande mudança ocorreu em 2003 com a aquisição de um forno de tempera horizontal para vidros de 2,8mm até 19mm.' },
  { image: '/images/linde_2007.jpg',  year: '2007', desc: 'Em março de 2008 foi instalado seu segundo forno horizontal.' },
  { image: '/images/linde_2009.jpg',  year: '2009', desc: 'Vidros insulados de alto desempenho para redução do consumo de energia.' },
  { image: '/images/linde_2012.jpg',  year: '2012', desc: 'Segurança e design com múltiplas camadas de proteção.' },
  { image: '/images/linde_2014.jpg',  year: '2014', desc: 'Resistência e durabilidade para aplicações de alto impacto.' },
  { image: '/images/linde_2018.jpg',  year: '2018', desc: 'Isolamento térmico e acústico para maior conforto.' },
  { image: '/images/linde_2025_1.jpg', year: '2025', label: 'Fábrica 1', desc: 'Personalização com impressão de alta qualidade.' },
  { image: '/images/linde_2025_2.jpg', year: '2025', label: 'Fábrica 2', desc: 'Espelhos sob medida para todos os ambientes.' },
]

const CARD_WIDTH = 480
const CARD_GAP   = 72
const CARD_TOTAL = CARD_WIDTH + CARD_GAP

// ─── Lightbox ──────────────────────────────────────────────────────────────
function Lightbox({ item, onClose, onPrev, onNext }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    window.dispatchEvent(new CustomEvent('modal-open'))
    return () => {
      window.removeEventListener('keydown', h)
      document.body.style.overflow = ''
      window.dispatchEvent(new CustomEvent('modal-close'))
    }
  }, [onClose])

  if (!item) return null
  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 99999,
        background: 'rgba(4,11,25,0.94)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, backdropFilter: 'blur(10px)',
      }}
    >
      <style>{`
        @keyframes lbFade { from{opacity:0} to{opacity:1} }
        @keyframes lbUp   { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .lb-overlay { animation: lbFade .2s ease; }
        .lb-modal   { animation: lbUp  .25s ease; }
      `}</style>
      <div className="lb-overlay" style={{ position: 'absolute', inset: 0 }} />
      <div
        className="lb-modal"
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative', maxWidth: 720, width: '100%',
          /* Sapphire escuro como fundo do modal */
          background: 'linear-gradient(145deg, rgba(35,60,100,0.98), rgba(4,11,25,0.98))',
          border: '1px solid rgba(95,130,155,0.3)',
          borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,.7)',
          zIndex: 1,
        }}
      >
        <div style={{ position: 'relative', maxHeight: 420, overflow: 'hidden' }}>
          <img src={item.image} alt={item.year}
            style={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(4,11,25,1) 0%,rgba(4,11,25,.3) 50%,transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: 20, left: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Badge do ano — Sunshine */}
            <span style={{ background: '#f0c832', color: '#040b19', fontWeight: 800, fontSize: 22, padding: '6px 18px', borderRadius: 8 }}>
              {item.year}
            </span>
            {item.label && (
              <span style={{ color: 'rgba(240,240,240,.75)', fontSize: 15, fontWeight: 600 }}>{item.label}</span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 14, right: 14, width: 36, height: 36,
              borderRadius: '50%', background: 'rgba(35,60,100,.7)', border: '1px solid rgba(95,130,155,.3)',
              color: '#f0f0f0', fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>
        <div style={{ padding: '22px 28px 28px' }}>
          <p style={{ color: 'rgba(240,240,240,.75)', fontSize: 15, lineHeight: 1.75, margin: '0 0 24px' }}>{item.desc}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            {[['← Anterior', onPrev, false], ['Próximo →', onNext, true]].map(([label, fn, primary]) => (
              <button
                key={label}
                onClick={fn}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  /* Sunshine para o botão primário */
                  background: primary ? 'rgba(240,200,50,.15)' : 'rgba(255,255,255,.05)',
                  border:     primary ? '1px solid rgba(240,200,50,.4)' : '1px solid rgba(95,130,155,.25)',
                  color:      primary ? '#f0c832' : 'rgba(240,240,240,.7)',
                }}
              >{label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  )
}

// ─── Card ──────────────────────────────────────────────────────────────────
function Card({ item, index, onOpen, dragInfoRef }) {
  const isAbove = index % 2 === 0
  const startPos = useRef({ x: 0, y: 0, t: 0 })
  const DRAG_THRESHOLD = 16
  const TIME_THRESHOLD = 500

  const handleDown = (x, y) => {
    startPos.current = { x, y, t: Date.now() }
    if (dragInfoRef?.current?.pause) dragInfoRef.current.pause()
  }
  const handleUp = (x, y) => {
    const dist    = Math.hypot(x - startPos.current.x, y - startPos.current.y)
    const elapsed = Date.now() - startPos.current.t
    if (dist < DRAG_THRESHOLD && elapsed < TIME_THRESHOLD) onOpen()
  }

  const badge = (
    <div style={{ textAlign: 'center', padding: isAbove ? '0 0 6px' : '6px 0 0', flexShrink: 0 }}>
      {/* Sunshine no badge */}
      <span style={{
        display: 'inline-block', background: '#f0c832', color: '#040b19',
        fontWeight: 800, fontSize: 20, letterSpacing: '.05em', padding: '8px 20px', borderRadius: 10,
      }}>{item.year}</span>
      {item.label && (
        <p style={{ color: 'rgba(240,240,240,.45)', fontSize: 15, margin: '6px 0 0', fontWeight: 600 }}>{item.label}</p>
      )}
    </div>
  )

  const connector = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      {/* Cold Steel nas linhas do conector */}
      <div style={{ width: 2, height: 36, background: 'rgba(95,130,155,.6)' }} />
      {/* Sunshine no ponto central */}
      <div style={{
        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
        background: '#f0c832', boxShadow: '0 0 16px rgba(240,200,50,.7)',
      }} />
      <div style={{ width: 2, height: 36, background: 'rgba(95,130,155,.6)' }} />
    </div>
  )

  const cardVisual = (
    <div
      onPointerDown={(e) => handleDown(e.clientX, e.clientY)}
      onPointerUp={(e)   => handleUp(e.clientX, e.clientY)}
      style={{
        width: CARD_WIDTH, flexShrink: 0,
        /* Sapphire escuro como fundo do card */
        background: 'linear-gradient(180deg, #1a2e50 0%, #0f1e38 100%)',
        border: '1px solid rgba(95,130,155,.2)',
        borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 6px 30px rgba(0,0,0,.5)',
        cursor: 'pointer',
        transition: 'transform .25s ease, box-shadow .25s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.04)'
        e.currentTarget.style.boxShadow = '0 10px 40px rgba(240,200,50,.2)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = '0 6px 30px rgba(0,0,0,.5)'
      }}
    >
      <div style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
        <img src={item.image} alt={item.year} draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(4,11,25,.85) 0%,transparent 55%)' }} />
        {/* Ícone lupa — Cold Steel */}
        <div style={{
          position: 'absolute', top: 14, right: 14, width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(95,130,155,.25)', border: '1px solid rgba(95,130,155,.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
        }}>🔍</div>
      </div>
      <div style={{ padding: '24px 26px' }}>
        <p style={{ color: 'rgba(240,240,240,.65)', fontSize: 18, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: CARD_WIDTH, flexShrink: 0, userSelect: 'none' }}>
      {isAbove ? (<>{badge}{connector}{cardVisual}</>) : (<>{cardVisual}{connector}{badge}</>)}
    </div>
  )
}

// ─── Componente principal ──────────────────────────────────────────────────
export default function LinhaDoTempo() {
  const trackRef    = useRef(null)
  const dragInfoRef = useRef({ offset: 0, startOffset: 0 })
  const [selected, setSelected] = useState(null)

  const offsetRef   = useRef(0)
  const rafRef      = useRef(null)
  const pausedRef   = useRef(false)
  const isDragging  = useRef(false)
  const lastX       = useRef(0)
  const resumeTimer = useRef(null)

  const items     = [...milestones, ...milestones, ...milestones]
  const loopWidth = milestones.length * CARD_TOTAL
  const SPEED     = 0.7

  const clamp = (v) => {
    if (v >= loopWidth * 2) return v - loopWidth
    if (v < loopWidth)      return v + loopWidth
    return v
  }

  useEffect(() => {
    offsetRef.current = loopWidth
    const tick = () => {
      if (!pausedRef.current && !isDragging.current)
        offsetRef.current = clamp(offsetRef.current + SPEED)
      if (trackRef.current)
        trackRef.current.style.transform = `translate3d(${-offsetRef.current}px,0,0)`
      dragInfoRef.current.offset = offsetRef.current
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [loopWidth])

  useEffect(() => { if (selected !== null) pausedRef.current = true }, [selected])

  const pauseAuto  = () => { pausedRef.current = true; clearTimeout(resumeTimer.current) }
  const resumeAuto = () => {
    if (selected !== null) return
    resumeTimer.current = setTimeout(() => { pausedRef.current = false }, 1500)
  }
  useEffect(() => { dragInfoRef.current.pause = () => { pauseAuto(); resumeAuto() } })

  const openCard  = (i) => setSelected(i % milestones.length)
  const closeCard = () => { setSelected(null); resumeTimer.current = setTimeout(() => { pausedRef.current = false }, 800) }
  const prevCard  = () => setSelected(s => (s - 1 + milestones.length) % milestones.length)
  const nextCard  = () => setSelected(s => (s + 1) % milestones.length)

  const onPointerDown = (e) => {
    e.stopPropagation()
    isDragging.current = true
    lastX.current = e.clientX
    pauseAuto()
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch (_) {}
    e.currentTarget.style.cursor = 'grabbing'
  }
  const onPointerMove = (e) => {
    if (!isDragging.current) return
    const dx = e.clientX - lastX.current
    lastX.current = e.clientX
    offsetRef.current = clamp(offsetRef.current - dx)
  }
  const onPointerUp = (e) => {
    if (!isDragging.current) return
    isDragging.current = false
    e.currentTarget.style.cursor = 'grab'
    resumeAuto()
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {selected !== null && (
        <Lightbox item={milestones[selected]} onClose={closeCard} onPrev={prevCard} onNext={nextCard} />
      )}

      <section style={{
        position: 'relative',
        padding: '2cm 0 40px',
        background: 'transparent',
        overflow: 'hidden',
        width: '100%', height: '100%',
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column',
      }}>
        <style>{`.timeline-track { will-change: transform; }`}</style>

        {/* Glow — Sapphire */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 1000, height: 500,
          background: 'radial-gradient(ellipse,rgba(35,60,100,.12) 0%,transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24, position: 'relative', zIndex: 10, flexShrink: 0 }}>
          <img src="/images/logonavbar.png" alt="Linde Vidros"
            style={{ height: 260, width: 'auto', objectFit: 'contain', display: 'inline-block' }} />
        </div>

        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: 40, position: 'relative', zIndex: 10, flexShrink: 0 }}>
          {/* Cold Steel no label superior */}
          <p style={{ color: '#5f829b', fontSize: 11, fontWeight: 700, letterSpacing: '.4em', textTransform: 'uppercase', margin: '0 0 12px' }}>
            Quem Somos?
          </p>
          <h2 style={{ color: '#f0f0f0', fontSize: 44, fontWeight: 800, margin: '0 0 16px', letterSpacing: '-.02em' }}>
            A Linde Vidros
          </h2>
          {/* Sunshine na linha decorativa */}
          <div style={{ width: 48, height: 2, background: '#f0c832', margin: '0 auto 14px', borderRadius: 2 }} />
          <p style={{ color: 'rgba(240,240,240,.28)', fontSize: 12, margin: 0 }}>
            Clique em um card para ver mais · Arraste para explorar
          </p>
        </div>

        {/* Carrossel */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%', minHeight: 0 }}>
          <div
            style={{ position: 'relative', overflow: 'hidden', cursor: 'grab', width: '100%', touchAction: 'pan-y' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {/* Linha horizontal — Cold Steel */}
            <div style={{
              position: 'absolute', top: '50%', left: 0, right: 0,
              height: 2, marginTop: -1,
              background: 'rgba(95,130,155,.4)',
              pointerEvents: 'none', zIndex: 0,
            }} />

            <div ref={trackRef} className="timeline-track" style={{
              position: 'relative', zIndex: 1,
              display: 'inline-flex', alignItems: 'center',
              gap: 0, padding: '20px 0',
            }}>
              {items.map((item, i) => (
                <div key={i} style={{ margin: `0 ${CARD_GAP / 2}px` }}>
                  <Card item={item} index={i} onOpen={() => openCard(i)} dragInfoRef={dragInfoRef} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}