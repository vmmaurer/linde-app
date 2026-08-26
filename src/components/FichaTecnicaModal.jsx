import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

// ── Pop-up "Ficha Técnica" (hoje só o Vidro Habitat usa) ──
// Abre POR CIMA do ProductModal, por isso o z-index maior e por isso
// ele NÃO dispara os eventos modal-open / modal-close: quem segura a
// navbar escondida é o card de produto que continua aberto atrás.
// Continua ouvindo force-close-modal (inatividade de 30s) e Escape.
//
// Paleta: Sapphire #233c64 · Cold Steel #5f82b9 · Sunshine #f0c832 · Off-white #f0f0f0

const isArr = Array.isArray

export default function FichaTecnicaModal({ ficha, onClose }) {
  const [ativa, setAtiva] = useState(0)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    window.addEventListener('force-close-modal', onClose)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('force-close-modal', onClose)
    }
  }, [onClose])

  if (!ficha) return null

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  const linha = ficha.linhas[ativa]
  const { mono, lam } = ficha.colunas

  return createPortal(
    <div
      className="fixed inset-0 flex flex-col items-center p-6"
      style={{ zIndex: 60, animation: 'fadeIn 0.28s ease forwards' }}
    >
      <div
        className="absolute inset-0"
        onPointerDown={onClose}
        style={{
          background: 'rgba(6, 14, 30, 0.88)',
          backdropFilter: 'blur(22px) saturate(140%)',
          WebkitBackdropFilter: 'blur(22px) saturate(140%)',
          animation: 'fadeIn 0.28s ease forwards',
        }}
      />

      {/* Espaçadores mantêm o card centralizado e o botão Fechar embaixo,
          exatamente como no ProductModal e no EstruturaModal */}
      <div style={{ flex: '1 1 0%', minHeight: 0 }} />

      <div
        className="relative w-full max-w-4xl rounded-3xl flex flex-col"
        style={{
          background: 'linear-gradient(160deg, rgba(23,38,64,0.99) 0%, rgba(16,27,48,0.99) 55%, rgba(12,21,38,0.99) 100%)',
          border: '1px solid rgba(143,177,217,0.22)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
          animation: 'fichaIn 0.42s cubic-bezier(0.22,1,0.36,1) forwards',
          maxHeight: '84vh',
          flexShrink: 0,
          overflow: 'hidden',
          zIndex: 1,
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Faixa Sunshine no topo do card */}
        <div style={{
          height: 3,
          background: 'linear-gradient(90deg, rgba(240,200,50,0) 0%, #f0c832 35%, #f0c832 65%, rgba(240,200,50,0) 100%)',
          flexShrink: 0,
        }} />

        <div className="flex flex-col overflow-y-auto" style={{ maxHeight: 'calc(84vh - 3px)' }}>

          {/* ── Cabeçalho ── */}
          <div style={{
            position: 'relative',
            padding: '30px 34px 26px',
            borderBottom: '1px solid rgba(143,177,217,0.16)',
            background: 'radial-gradient(120% 140% at 50% -20%, rgba(95,130,185,0.20) 0%, rgba(95,130,185,0) 62%)',
          }}>
            {ficha.brandLogo && (
              <img
                src={ficha.brandLogo}
                alt=""
                style={{
                  position: 'absolute', top: 26, right: 30,
                  height: 46, width: 'auto', opacity: 0.9,
                }}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
            )}

            <div style={{ textAlign: 'center' }}>
              <p style={{
                color: '#f0c832',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '.42em',
                textTransform: 'uppercase',
                margin: '0 0 8px',
                animation: 'fichaRise 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both',
              }}>
                {ficha.eyebrow}
              </p>
              <h2 style={{
                color: '#f0f0f0',
                fontSize: 40,
                fontWeight: 800,
                letterSpacing: '-.02em',
                margin: 0,
                lineHeight: 1.05,
                textTransform: 'uppercase',
                animation: 'fichaRise 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both',
              }}>
                {ficha.titulo}
              </h2>
              <div style={{
                width: 52, height: 2, borderRadius: 2, background: '#f0c832',
                margin: '16px auto 0',
                animation: 'fichaLine 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s both',
              }} />
            </div>

            {/* ── Alternador entre as duas linhas ── */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
              <div style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: `repeat(${ficha.linhas.length}, 1fr)`,
                gap: 4,
                padding: 5,
                borderRadius: '99rem',
                background: 'rgba(8,16,32,0.6)',
                border: '1px solid rgba(143,177,217,0.20)',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.35)',
                animation: 'fichaRise 0.5s cubic-bezier(0.22,1,0.36,1) 0.16s both',
              }}>
                {/* Pílula deslizante — segue a aba ativa */}
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: 5, bottom: 5, left: 5,
                    width: `calc((100% - 10px - ${(ficha.linhas.length - 1) * 4}px) / ${ficha.linhas.length})`,
                    transform: `translateX(calc(${ativa} * (100% + 4px)))`,
                    transition: 'transform 0.42s cubic-bezier(0.65,0,0.35,1), background 0.42s ease, box-shadow 0.42s ease',
                    borderRadius: '99rem',
                    background: `linear-gradient(145deg, ${linha.accent}2e 0%, rgba(35,60,100,0.9) 100%)`,
                    border: '1px solid rgba(240,200,50,0.55)',
                    boxShadow: `0 6px 20px rgba(0,0,0,0.4), 0 0 22px ${linha.accent}33, inset 0 1px 0 rgba(255,255,255,0.14)`,
                  }}
                />
                {ficha.linhas.map((l, i) => (
                  <button
                    key={l.id}
                    onPointerDown={() => setAtiva(i)}
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      padding: '15px 34px',
                      minHeight: 56,
                      borderRadius: '99rem',
                      border: 'none',
                      background: 'transparent',
                      color: i === ativa ? '#f0f0f0' : 'rgba(240,240,240,0.52)',
                      fontSize: 16,
                      fontWeight: i === ativa ? 700 : 500,
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      transition: 'color 0.3s ease',
                      touchAction: 'manipulation',
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <p style={{
              textAlign: 'center',
              margin: '14px 0 0',
              fontSize: 13,
              color: 'rgba(240,240,240,0.45)',
            }}>
              <span key={linha.id} style={{ display: 'inline-block', animation: 'fichaFade 0.4s ease both' }}>
                {linha.resumo}
              </span>
            </p>
          </div>

          {/* ── Tabelas da linha ativa ── */}
          <div
            key={linha.id}
            style={{ padding: '26px 30px 30px', animation: 'fichaSwap 0.45s cubic-bezier(0.22,1,0.36,1) both' }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  minWidth: 740,
                  borderCollapse: 'separate',
                  borderSpacing: 0,
                  tableLayout: 'fixed',
                }}
              >
                <colgroup>
                  <col style={{ width: 104 }} />
                  <col style={{ width: 176 }} />
                  <col style={{ width: 50 }} />
                  {[...mono, ...lam].map((_, i) => <col key={i} />)}
                </colgroup>

                <thead>
                  <tr>
                    <th colSpan={3} style={{ padding: 0, border: 'none' }} />
                    <th colSpan={mono.length} style={cabecalhoGrupo('rgba(95,130,185,0.26)', 'rgba(200,221,240,0.9)')}>
                      Monolítico
                    </th>
                    <th colSpan={lam.length} style={cabecalhoGrupo('linear-gradient(180deg, #f08a33 0%, #e5701c 100%)', '#ffffff')}>
                      Laminados
                    </th>
                  </tr>
                </thead>

                {linha.vidros.map((vidro, vi) => {
                  const ultimoBloco = vi === linha.vidros.length - 1
                  return (
                    <tbody
                      key={vidro.nome}
                      style={{ animation: `fichaBloco 0.5s cubic-bezier(0.22,1,0.36,1) ${0.06 + vi * 0.09}s both` }}
                    >
                      {/* Nome do vidro + espessuras */}
                      <tr>
                        <th colSpan={3} style={{
                          textAlign: 'left',
                          padding: '13px 14px',
                          background: `linear-gradient(90deg, ${vidro.accent}26 0%, rgba(35,60,100,0.28) 100%)`,
                          borderTop: `1px solid ${vidro.accent}55`,
                          borderLeft: `3px solid ${vidro.accent}`,
                          color: '#f0f0f0',
                          fontSize: 15,
                          fontWeight: 800,
                          letterSpacing: '-.01em',
                          whiteSpace: 'nowrap',
                        }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                            <Swatch tint={vidro.tint} />
                            {vidro.nome}
                          </span>
                        </th>
                        {mono.map((e) => (
                          <th key={`m-${e}`} style={celulaEspessura('rgba(95,130,185,0.16)', 'rgba(214,228,242,0.92)', vidro.accent)}>{e}</th>
                        ))}
                        {lam.map((e) => (
                          <th key={`l-${e}`} style={celulaEspessura('rgba(238,127,45,0.20)', '#ffd2ae', vidro.accent)}>{e}</th>
                        ))}
                      </tr>

                      {/* Métricas */}
                      {vidro.metricas.map((m, mi) => {
                        const inicioGrupo = mi === 0 || vidro.metricas[mi - 1].grupo !== m.grupo
                        const tamanhoGrupo = vidro.metricas.filter((x) => x.grupo === m.grupo).length
                        const ultimaLinha = mi === vidro.metricas.length - 1
                        const zebra = mi % 2 === 1
                        const cantoInferior = ultimaLinha && ultimoBloco

                        return (
                          <tr key={m.abbr + mi}>
                            {inicioGrupo && (
                              <th
                                rowSpan={tamanhoGrupo}
                                style={{
                                  padding: '10px 12px',
                                  background: `linear-gradient(180deg, ${vidro.accent}1f 0%, ${vidro.accent}0d 100%)`,
                                  borderLeft: `3px solid ${vidro.accent}`,
                                  borderBottom: '1px solid rgba(143,177,217,0.12)',
                                  borderBottomLeftRadius: cantoInferior ? 10 : 0,
                                  color: vidro.accent,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  lineHeight: 1.25,
                                  textAlign: 'left',
                                  verticalAlign: 'middle',
                                }}
                              >
                                {m.grupo}
                              </th>
                            )}

                            <td style={celulaLabel(zebra)}>{m.label}</td>
                            <td style={celulaAbbr(zebra, vidro.accent)}>{m.abbr}</td>

                            {isArr(m.mono)
                              ? m.mono.map((v, i) => <td key={`m${i}`} style={celulaValor(zebra, false)}>{v}</td>)
                              : <td colSpan={mono.length} style={celulaValor(zebra, false, true)}>{m.mono}</td>}

                            {isArr(m.lam)
                              ? m.lam.map((v, i) => <td key={`l${i}`} style={celulaValor(zebra, true)}>{v}</td>)
                              : <td colSpan={lam.length} style={celulaValor(zebra, true, true)}>{m.lam}</td>}
                          </tr>
                        )
                      })}
                    </tbody>
                  )
                })}
              </table>
            </div>

            {/* Nota de rodapé */}
            {linha.nota && (
              <p style={{
                margin: '18px 0 0',
                fontSize: 12.5,
                lineHeight: 1.5,
                color: 'rgba(240,240,240,0.5)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
              }}>
                <span style={{ color: '#f0c832', fontWeight: 700, flexShrink: 0 }}>*</span>
                {linha.nota.replace(/^\*/, '')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Botão fechar — mesmo padrão dos outros pop-ups do totem */}
      <div className="w-full flex items-center justify-center" style={{ flex: '1 1 0%', minHeight: 0, zIndex: 1 }}>
        <button
          onPointerDown={onClose}
          aria-label="Fechar ficha técnica"
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
            animation: 'fichaRise 0.45s cubic-bezier(0.22,1,0.36,1) 0.18s both',
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
        @keyframes fichaIn {
          from { opacity: 0; transform: scale(0.94) translateY(26px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fichaRise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fichaFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fichaLine {
          from { opacity: 0; transform: scaleX(0); }
          to   { opacity: 1; transform: scaleX(1); }
        }
        @keyframes fichaSwap {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fichaBloco {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>,
    modalRoot
  )
}

// ── Peças auxiliares ──

// Amostra do tom real do vidro, com brilho de superfície.
function Swatch({ tint }) {
  const [a, b] = tint
  return (
    <span
      aria-hidden
      style={{
        width: 16, height: 16, borderRadius: 5, flexShrink: 0,
        background: `linear-gradient(145deg, ${b} 0%, ${a} 55%, ${b} 100%)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 0 10px ${a}66`,
        border: '1px solid rgba(255,255,255,0.28)',
      }}
    />
  )
}

// ── Estilos de célula ──

const cabecalhoGrupo = (fundo, cor) => ({
  padding: '9px 10px',
  background: fundo,
  color: cor,
  fontSize: 11.5,
  fontWeight: 700,
  letterSpacing: '.16em',
  textTransform: 'uppercase',
  borderRadius: '8px 8px 0 0',
  textAlign: 'center',
})

const celulaEspessura = (fundo, cor, accent) => ({
  padding: '13px 4px',
  background: fundo,
  color: cor,
  fontSize: 13,
  fontWeight: 700,
  textAlign: 'center',
  borderTop: `1px solid ${accent}55`,
  whiteSpace: 'nowrap',
})

const celulaLabel = (zebra) => ({
  padding: '10px 12px',
  background: zebra ? 'rgba(255,255,255,0.028)' : 'transparent',
  borderBottom: '1px solid rgba(143,177,217,0.10)',
  color: 'rgba(240,240,240,0.82)',
  fontSize: 13.5,
  fontWeight: 500,
  whiteSpace: 'nowrap',
})

const celulaAbbr = (zebra, accent) => ({
  padding: '10px 6px',
  background: zebra ? 'rgba(255,255,255,0.028)' : 'transparent',
  borderBottom: '1px solid rgba(143,177,217,0.10)',
  color: accent,
  fontSize: 12,
  fontWeight: 700,
  textAlign: 'center',
  letterSpacing: '.04em',
})

const celulaValor = (zebra, laminado, mesclada = false) => ({
  padding: '10px 4px',
  background: laminado
    ? (zebra ? 'rgba(238,127,45,0.075)' : 'rgba(238,127,45,0.042)')
    : (zebra ? 'rgba(255,255,255,0.028)' : 'transparent'),
  borderBottom: '1px solid rgba(143,177,217,0.10)',
  borderLeft: '1px solid rgba(143,177,217,0.07)',
  color: mesclada ? '#f0c832' : '#f0f0f0',
  fontSize: mesclada ? 13.5 : 14.5,
  fontWeight: mesclada ? 700 : 600,
  textAlign: 'center',
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: mesclada ? '.06em' : 0,
})
