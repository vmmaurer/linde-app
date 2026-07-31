import React, { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

// ── Paleta ──
// Sapphire Glass #233c64 · Cold Steel #5f829b · Sunshine #f0c832
// Midnight #323232 · Off-white #f0f0f0

const milestones = [
  { image: '/images/linde_1989.jpeg', year: '1966', desc: 'Em 1966 teve início a história da Linde Vidros, fundada com o propósito de oferecer qualidade, confiança e soluções para o setor vidreiro.' },
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
  { image: '/images/totem.jpeg',       year: '2027', desc: 'A Linde Vidros segue em frente, com novas fábricas, tecnologias e soluções em vidro para os próximos capítulos da nossa história.' },
]

const CARD_WIDTH = 480
const CARD_GAP   = 180
const CARD_TOTAL = CARD_WIDTH + CARD_GAP
// Mantém pontos suficientes calculados fora da tela para a curva já chegar
// pronta às bordas do viewport, inclusive no início de cada ciclo.
const LINE_OVERSCAN = CARD_TOTAL * 2

// ── Parâmetros do destaque central ────────────────────────────────────────
// A fileira fica reta e estável; SÓ o card que chega ao centro ganha realce:
// sobe um pouco (flutua) e cresce levemente.
const LIFT_AMOUNT    = 110        // quanto o card central sobe (px). 0 = não sobe
const SCALE_CENTER   = 1.35       // escala do card centralizado (realce forte)
const SCALE_EDGE     = 0.9        // demais cards levemente menores, reforçando o destaque
const FOCUS_WIDTH    = CARD_TOTAL * 0.8   // largura da zona de foco

// Desaceleração suave perto do centro: o track anda mais devagar
// quando um card está centralizado, criando a sensação de "respiro".
const SLOWDOWN_MAX   = 0.55       // 0 = sem freio, 1 = para totalmente no centro
const BASE_SPEED     = 1.3        // velocidade base do auto-scroll

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
// Agora todos os cards têm a mesma estrutura (imagem + conector + badge).
// O conector aponta pra linha central; a onda/escala são aplicadas pelo pai
// via ref (cardRef), frame a frame.
function Card({ item, onOpen, dragInfoRef, cardRef, bookend }) {
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

  return (
    <div
      ref={cardRef}
      style={{
        width: CARD_WIDTH, flexShrink: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        userSelect: 'none',
        willChange: 'transform, opacity',
        // transform/opacity/zIndex são escritos pelo loop de animação
      }}
    >
      {/* Conector: liga o topo do card até a linha central ondulada.
          O comprimento é ajustado pelo pai para acompanhar a onda. */}
      <div className="card-connector" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        {bookend && (
          <span style={{
            position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
            marginBottom: 8, whiteSpace: 'nowrap',
            fontSize: 12, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase',
            color: '#f0c832', background: 'rgba(240,200,50,.12)', border: '1px solid rgba(240,200,50,.35)',
            borderRadius: 999, padding: '5px 14px',
          }}>
            {bookend === 'start' ? 'Fundação' : 'Continua…'}
          </span>
        )}
        <div className="connector-dot" style={{
          width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
          background: 'transparent',
        }} />
        <div className="connector-line" style={{ width: 2, height: 42, background: 'rgba(95,130,155,.6)' }} />
      </div>

      {/* Badge do ano */}
      <div className="card-badge" style={{ textAlign: 'center', padding: '6px 0 10px', flexShrink: 0 }}>
        <span style={{
          display: 'inline-block', background: '#f0c832', color: '#040b19',
          fontWeight: 800, fontSize: 20, letterSpacing: '.05em', padding: '8px 20px', borderRadius: 10,
        }}>{item.year}</span>
        {item.label && (
          <p style={{ color: 'rgba(240,240,240,.5)', fontSize: 15, margin: '6px 0 0', fontWeight: 600 }}>{item.label}</p>
        )}
      </div>

      {/* Visual do card */}
      <div
        onPointerDown={(e) => handleDown(e.clientX, e.clientY)}
        onPointerUp={(e)   => handleUp(e.clientX, e.clientY)}
        style={{
          width: CARD_WIDTH, flexShrink: 0,
          background: 'linear-gradient(180deg, #1a2e50 0%, #0f1e38 100%)',
          border: '1px solid rgba(240,200,50,.55)',
          borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 6px 30px rgba(0,0,0,.5)',
          cursor: 'pointer',
        }}
      >
        <div style={{ position: 'relative', height: 300, overflow: 'hidden' }}>
          <img src={item.image} alt={item.year} draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(4,11,25,.85) 0%,transparent 55%)' }} />
        </div>
        <div style={{ padding: '22px 26px', height: 150, boxSizing: 'border-box', overflow: 'hidden' }}>
          <p style={{ color: 'rgba(240,240,240,.65)', fontSize: 18, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Componente principal ──────────────────────────────────────────────────
export default function LinhaDoTempo() {
  const viewportRef = useRef(null)   // container visível (para achar o centro)
  const trackRef    = useRef(null)
  const wavePathRef = useRef(null)   // path SVG da linha amarela ondulada
  const waveDotsRef = useRef(null)   // grupo SVG dos pontos, por cima da linha
  const dragInfoRef = useRef({ offset: 0, startOffset: 0 })
  const [selected, setSelected] = useState(null)

  const offsetRef   = useRef(0)
  const rafRef      = useRef(null)
  const pausedRef   = useRef(false)
  const isDragging  = useRef(false)
  const lastX       = useRef(0)
  const resumeTimer = useRef(null)

  // refs de cada card, para aplicar transform frame a frame
  const cardRefs = useRef([])

  const items     = [...milestones, ...milestones, ...milestones]
  const loopWidth = milestones.length * CARD_TOTAL

  const clamp = (v) => {
    if (v >= loopWidth * 2) return v - loopWidth
    if (v < loopWidth)      return v + loopWidth
    return v
  }

  // curva de destaque em função da distância ao centro (gaussiana)
  const focusCurve = (dist) => {
    const x = dist / FOCUS_WIDTH
    return Math.exp(-(x * x))   // 1 no centro → 0 nas bordas
  }

  useEffect(() => {
    offsetRef.current = loopWidth

    const applyWave = () => {
      const vp = viewportRef.current
      if (!vp) return
      const vpRect = vp.getBoundingClientRect()
      const centerX = vp.clientWidth / 2

      const pts = []   // pontos {x, y} da linha ondulada

      for (let i = 0; i < cardRefs.current.length; i++) {
        const el = cardRefs.current[i]
        if (!el) continue

        // posição do centro do card na tela
        const cardCenter = (i * CARD_TOTAL) + CARD_TOTAL / 2 - offsetRef.current + CARD_GAP / 2
        const dist = cardCenter - centerX

        // foco (0..1): 1 quando centralizado, ~0 para os demais
        const focus = focusCurve(dist)

        // escala: normal fora, cresce só perto do centro
        const scale = SCALE_EDGE + (SCALE_CENTER - SCALE_EDGE) * focus

        // levantar: só o card central sobe (valor negativo = sobe)
        const liftY = -LIFT_AMOUNT * focus

        // opacidade e profundidade: leve destaque no foco, resto totalmente visível
        const opacity = 0.7 + 0.3 * focus
        const z = Math.round(focus * 1000)

        el.style.transform = `translate3d(0, ${liftY}px, 0) scale(${scale})`
        el.style.opacity   = opacity
        el.style.zIndex    = z

        // conector: leve realce no card central
        const conn = el.querySelector('.card-connector')
        if (conn) {
          conn.style.opacity = (0.55 + 0.45 * focus).toFixed(2)
        }

        // ponto da linha: MEDIDO na posição real do ponto dourado deste card,
        // já refletindo escala e lift. A linha passa exatamente pelos pontos,
        // com uma pequena folga acima para nunca tocar os cards.
        if (cardCenter > -LINE_OVERSCAN && cardCenter < vp.clientWidth + LINE_OVERSCAN) {
          const dot = el.querySelector('.connector-dot')
          if (dot) {
            const dRect = dot.getBoundingClientRect()
            const LINE_GAP_ABOVE = 0  // ponto/linha centrados na ponta da haste
            const x = dRect.left + dRect.width / 2 - vpRect.left
            const y = dRect.top + dRect.height / 2 - vpRect.top - LINE_GAP_ABOVE
            // cycle = qual repetição do array de milestones este card pertence.
            // usado para NÃO conectar a linha entre o fim de um ciclo (2027)
            // e o início do próximo (1966) — cada ciclo tem sua própria linha,
            // do card "Fundação" até o card "Continua…".
            pts.push({ x, y, cycle: Math.floor(i / milestones.length) })
          }
        }
      }

      // desenha a linha amarela ligando os pontos dourados como curva suave,
      // em segmentos separados por ciclo (corta a linha entre 2027 e 1966).
      if (wavePathRef.current) {
        pts.sort((a, b) => a.x - b.x)
        const cycles = new Map()
        for (const p of pts) {
          if (!cycles.has(p.cycle)) cycles.set(p.cycle, [])
          cycles.get(p.cycle).push(p)
        }
        const K = 0.12
        let d = ''
        for (const seg of cycles.values()) {
          if (seg.length < 2) continue
          d += `M ${seg[0].x.toFixed(1)} ${seg[0].y.toFixed(1)}`
          for (let i = 0; i < seg.length - 1; i++) {
            const p0 = seg[i - 1] || seg[i]
            const p1 = seg[i]
            const p2 = seg[i + 1]
            const p3 = seg[i + 2] || p2
            const c1x = p1.x + (p2.x - p0.x) * K
            const c1y = p1.y + (p2.y - p0.y) * K
            const c2x = p2.x - (p3.x - p1.x) * K
            const c2y = p2.y - (p3.y - p1.y) * K
            d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
          }
        }
        wavePathRef.current.setAttribute('d', d)
      }

      // desenha os pontos por cima da linha (sempre na frente)
      if (waveDotsRef.current) {
        const ns = 'http://www.w3.org/2000/svg'
        const g = waveDotsRef.current
        // garante um círculo para cada ponto (reaproveita nós existentes)
        while (g.childNodes.length < pts.length) {
          const c = document.createElementNS(ns, 'circle')
          c.setAttribute('r', '8')
          c.setAttribute('fill', '#1a2e50')
          c.setAttribute('stroke', '#5f829b')
          c.setAttribute('stroke-width', '2')
          g.appendChild(c)
        }
        while (g.childNodes.length > pts.length) {
          g.removeChild(g.lastChild)
        }
        pts.forEach((p, idx) => {
          const c = g.childNodes[idx]
          c.setAttribute('cx', p.x.toFixed(1))
          c.setAttribute('cy', p.y.toFixed(1))
        })
      }
    }

    const tick = () => {
      if (!pausedRef.current && !isDragging.current) {
        // desaceleração suave: quando algum card está no centro,
        // reduz a velocidade proporcionalmente ao foco máximo.
        const vp = viewportRef.current
        let maxFocus = 0
        if (vp) {
          const centerX = vp.clientWidth / 2
          for (let i = 0; i < cardRefs.current.length; i++) {
            const cardCenter = (i * CARD_TOTAL) + CARD_TOTAL / 2 - offsetRef.current + CARD_GAP / 2
            const f = focusCurve(cardCenter - centerX)
            if (f > maxFocus) maxFocus = f
          }
        }
        const speed = BASE_SPEED * (1 - SLOWDOWN_MAX * maxFocus)
        offsetRef.current = clamp(offsetRef.current + speed)
      }

      if (trackRef.current)
        trackRef.current.style.transform = `translate3d(${-offsetRef.current}px,0,0)`

      applyWave()
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
        padding: '0 0 40px',
        background: 'transparent',
        overflow: 'hidden',
        width: '100%', height: '100%',
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column',
      }}>
        <style>{`
          .timeline-track { will-change: transform; }
          .wave-card { transition: none; }
        `}</style>

        {/* Glow — Sapphire */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 1000, height: 500,
          background: 'radial-gradient(ellipse,rgba(35,60,100,.12) 0%,transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div className="brand-masthead" style={{ textAlign: 'center', marginBottom: 32, position: 'relative', zIndex: 10, flexShrink: 0 }}>
          <img src="/images/logonavbar.png" alt="Linde Vidros"
            className="brand-masthead__logo" />
        </div>

        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: 40, position: 'relative', zIndex: 10, flexShrink: 0 }}>
          <p style={{ color: '#5f829b', fontSize: 11, fontWeight: 700, letterSpacing: '.4em', textTransform: 'uppercase', margin: '0 0 12px' }}>
            Quem Somos?
          </p>
          <h2 style={{ color: '#f0f0f0', fontSize: 44, fontWeight: 800, margin: '0 0 16px', letterSpacing: '-.02em' }}>
            A Linde Vidros
          </h2>
          <div style={{ width: 48, height: 2, background: '#f0c832', margin: '0 auto 14px', borderRadius: 2 }} />
          <p style={{ color: 'rgba(240,240,240,.28)', fontSize: 12, margin: 0 }}>
            Clique em um card para ver mais · Arraste para explorar
          </p>
        </div>

        {/* Carrossel */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%', minHeight: 0 }}>
          <div
            ref={viewportRef}
            style={{ position: 'relative', overflow: 'hidden', cursor: 'grab', width: '100%', height: '100%', touchAction: 'pan-y', display: 'flex', alignItems: 'center' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {/* Linha central de referência — sutil, o efeito principal é a onda dos cards */}
            <div style={{
              position: 'absolute', top: '50%', left: 0, right: 0,
              height: 2, marginTop: -1,
              background: 'rgba(95,130,155,.25)',
              pointerEvents: 'none', zIndex: 0,
            }} />

            {/* Linha amarela ondulada + pontos, sempre acima dos cards */}
            <svg
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none', zIndex: 2000,
                overflow: 'visible',
              }}
            >
              <path
                ref={wavePathRef}
                d=""
                fill="none"
                stroke="#f0c832"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 0 8px rgba(240,200,50,.5))' }}
              />
              {/* pontos desenhados por cima da linha */}
              <g ref={waveDotsRef} />
            </svg>

            <div ref={trackRef} className="timeline-track" style={{
              position: 'relative', zIndex: 1,
              display: 'inline-flex', alignItems: 'center',
              gap: 0, padding: '20px 0',
            }}>
              {items.map((item, i) => {
                const mIdx = i % milestones.length
                const bookend = mIdx === 0 ? 'start' : mIdx === milestones.length - 1 ? 'end' : null
                return (
                  <div key={i} className="wave-card" style={{ margin: `0 ${CARD_GAP / 2}px` }}>
                    <Card
                      item={item}
                      onOpen={() => openCard(i)}
                      dragInfoRef={dragInfoRef}
                      cardRef={(el) => { cardRefs.current[i] = el }}
                      bookend={bookend}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
