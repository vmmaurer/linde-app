import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import SlotMachine from './SlotMachine'

// ── Pop-up do Sorteio ──
// Abre pelo botão do canto superior direito. Explica em três passos como
// participar e traz o mesmo QR Code da tela de Contato (leva ao Instagram).
// Segue a casca dos outros pop-ups do totem: overlay escuro + card
// centralizado + botão Fechar embaixo.
//
// Paleta: Sapphire #233c64 · Cold Steel #5f82b9 · Sunshine #f0c832 · Off-white #f0f0f0

const PASSOS = [
  {
    titulo: 'Siga-nos no Instagram',
    texto: 'Aponte a câmera do celular para o QR Code ao lado.',
    icone: (
      <>
        <rect x="3.2" y="3.2" width="15.6" height="15.6" rx="4.6" stroke="#f0c832" strokeWidth="1.7" />
        <circle cx="11" cy="11" r="3.9" stroke="#f0c832" strokeWidth="1.7" />
        <circle cx="15.7" cy="6.3" r="1.15" fill="#f0c832" />
      </>
    ),
  },
  {
    titulo: 'Tire uma foto no estande',
    texto: 'Registre o momento no estande da Linde na FESQUA.',
    icone: (
      <>
        <path d="M3 8.2A1.8 1.8 0 0 1 4.8 6.4h1.9l1.2-2h6.2l1.2 2h1.9A1.8 1.8 0 0 1 19 8.2v8A1.8 1.8 0 0 1 17.2 18H4.8A1.8 1.8 0 0 1 3 16.2z"
          stroke="#f0c832" strokeWidth="1.7" strokeLinejoin="round" />
        <circle cx="11" cy="11.8" r="3.3" stroke="#f0c832" strokeWidth="1.7" />
      </>
    ),
  },
  {
    titulo: 'Marque a gente no story',
    texto: 'Publique e marque a Linde Vidros para validar a participação.',
    icone: (
      <>
        <path d="M11 2.6c4.6 0 8.4 3.7 8.4 8.4S15.6 19.4 11 19.4c-1.4 0-2.8-.35-4-1L3 19.4l1.1-3.8a8.3 8.3 0 0 1-1.1-4.1C3 6.3 6.4 2.6 11 2.6z"
          stroke="#f0c832" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M7.6 11.6l2.4 2.4 4.6-5" stroke="#f0c832" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
]

export default function SorteioModal({ onClose }) {
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

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col items-center p-6" style={{ animation: 'fadeIn 0.3s ease forwards' }}>
      <div
        className="absolute inset-0"
        onPointerDown={onClose}
        style={{
          background: 'rgba(5, 12, 26, 0.88)',
          backdropFilter: 'blur(22px) saturate(140%)',
          WebkitBackdropFilter: 'blur(22px) saturate(140%)',
          animation: 'fadeIn 0.3s ease forwards',
        }}
      />

      <div style={{ flex: '1 1 0%', minHeight: 0 }} />

      <div
        className="relative w-full max-w-4xl rounded-3xl flex flex-col"
        style={{
          background: 'linear-gradient(160deg, rgba(23,38,64,0.99) 0%, rgba(15,26,46,0.99) 55%, rgba(11,19,35,0.99) 100%)',
          border: '1px solid rgba(240,200,50,0.28)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.6), 0 0 60px rgba(240,200,50,0.10), inset 0 1px 0 rgba(255,255,255,0.08)',
          animation: 'sorteioModalIn 0.45s cubic-bezier(0.22,1,0.36,1) forwards',
          maxHeight: '84vh',
          flexShrink: 0,
          overflow: 'hidden',
          zIndex: 1,
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Faixa Sunshine no topo */}
        <div style={{
          height: 3,
          background: 'linear-gradient(90deg, rgba(240,200,50,0) 0%, #f0c832 35%, #f0c832 65%, rgba(240,200,50,0) 100%)',
          flexShrink: 0,
        }} />

        <div className="flex flex-col overflow-y-auto" style={{ maxHeight: 'calc(84vh - 3px)' }}>

          {/* ── Cabeçalho ── */}
          <div style={{
            position: 'relative',
            padding: '34px 40px 30px',
            textAlign: 'center',
            background: 'radial-gradient(120% 150% at 50% -25%, rgba(240,200,50,0.16) 0%, rgba(240,200,50,0) 62%)',
            borderBottom: '1px solid rgba(240,200,50,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ animation: 'sorteioSobe 0.55s cubic-bezier(0.22,1,0.36,1) 0.05s both' }}>
                <SlotMachine escala={1.5} />
              </div>
            </div>

            <p style={{
              color: '#f0c832', fontSize: 12, fontWeight: 700, letterSpacing: '.42em',
              textTransform: 'uppercase', margin: '0 0 10px',
              animation: 'sorteioSobe 0.55s cubic-bezier(0.22,1,0.36,1) 0.12s both',
            }}>
              Sorteio Linde na Fesqua
            </p>

            <h2 style={{
              color: '#f0f0f0', fontSize: 40, fontWeight: 800, letterSpacing: '-.02em',
              lineHeight: 1.1, margin: 0, textTransform: 'uppercase',
              animation: 'sorteioSobe 0.55s cubic-bezier(0.22,1,0.36,1) 0.18s both',
            }}>
              Quer concorrer a<br />
              <span style={{ color: '#f0c832', textShadow: '0 0 26px rgba(240,200,50,0.45)' }}>prêmios exclusivos?</span>
            </h2>

            <div style={{
              width: 52, height: 2, borderRadius: 2, background: '#f0c832', margin: '18px auto 0',
              animation: 'sorteioLinha 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s both',
            }} />
          </div>

          {/* ── Passos + QR ── */}
          <div style={{ display: 'flex', gap: 34, padding: '30px 40px 26px', alignItems: 'flex-start' }}>

            {/* Passos, ligados por uma trilha vertical */}
            <ol className="sorteio-passos">
              {PASSOS.map((p, i) => (
                <li
                  key={p.titulo}
                  className="sorteio-passo"
                  style={{ animation: `sorteioSobe 0.5s cubic-bezier(0.22,1,0.36,1) ${0.34 + i * 0.1}s both` }}
                >
                  <span className="sorteio-passo__num">
                    {i + 1}
                    <span className="sorteio-passo__anel" aria-hidden />
                  </span>
                  <div className="sorteio-passo__corpo">
                    <div className="sorteio-passo__titulo">
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
                        {p.icone}
                      </svg>
                      {p.titulo}
                    </div>
                    <p className="sorteio-passo__texto">{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* QR — o mesmo da tela de Contato */}
            <div
              className="sorteio-qr"
              style={{ animation: 'sorteioSobe 0.55s cubic-bezier(0.22,1,0.36,1) 0.4s both' }}
            >
              <div className="sorteio-qr__moldura">
                <img
                  src="./images/qrcode_linktree_totem.webp"
                  alt="QR Code para seguir a Linde Vidros no Instagram"
                  style={{ width: 190, height: 190, objectFit: 'contain', display: 'block' }}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                />
                <span className="sorteio-qr__scan" aria-hidden />
              </div>

              <div className="sorteio-qr__selo">
                <img
                  src="./images/ICON_INSTAGRAM.webp"
                  alt=""
                  style={{ width: 22, height: 22, objectFit: 'contain' }}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                />
                <span>Siga no Instagram</span>
              </div>
            </div>
          </div>

          {/* ── Fecho: pronto, está concorrendo ── */}
          <div
            className="sorteio-pronto"
            style={{ animation: 'sorteioSobe 0.55s cubic-bezier(0.22,1,0.36,1) 0.66s both' }}
          >
            <span className="sorteio-pronto__brilho" aria-hidden />
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, zIndex: 1 }}>
              <circle cx="12" cy="12" r="10" stroke="#f0c832" strokeWidth="2" />
              <path d="M7.4 12.3l3.1 3.1 6.1-6.6" stroke="#f0c832" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ zIndex: 1 }}>
              <p className="sorteio-pronto__titulo">Pronto! Você já está concorrendo</p>
              <p className="sorteio-pronto__texto">Boa sorte — o resultado sai pelo nosso Instagram.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botão fechar — mesmo padrão dos outros pop-ups */}
      <div className="w-full flex items-center justify-center" style={{ flex: '1 1 0%', minHeight: 0, zIndex: 1 }}>
        <button
          onPointerDown={onClose}
          aria-label="Fechar"
          style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '30px 68px', borderRadius: '99rem',
            background: 'rgba(35, 60, 100, 0.65)',
            border: '2.5px solid rgba(240,200,50,0.6)',
            boxShadow: '0 10px 36px rgba(0,0,0,0.4), 0 0 28px rgba(240,200,50,0.22), inset 0 1px 1px rgba(255,255,255,0.15)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            color: '#f0f0f0', cursor: 'pointer',
            animation: 'sorteioSobe 0.5s cubic-bezier(0.22,1,0.36,1) 0.2s both',
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
        @keyframes sorteioModalIn {
          from { opacity: 0; transform: scale(0.94) translateY(26px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes sorteioSobe {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sorteioLinha {
          from { opacity: 0; transform: scaleX(0); }
          to   { opacity: 1; transform: scaleX(1); }
        }

        /* ── Trilha de passos ── */
        .sorteio-passos {
          position: relative;
          flex: 1;
          min-width: 0;
          list-style: none;
          margin: 0;
          padding: 0 0 0 4px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        /* linha que conecta os três números */
        .sorteio-passos::before {
          content: '';
          position: absolute;
          left: 25px;
          top: 34px;
          bottom: 34px;
          width: 2px;
          border-radius: 2px;
          background: linear-gradient(180deg,
                      rgba(240,200,50,0.55) 0%,
                      rgba(240,200,50,0.28) 100%);
        }
        .sorteio-passo {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 18px;
        }
        .sorteio-passo__num {
          position: relative;
          flex-shrink: 0;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 800;
          color: #f0c832;
          background: rgba(11,20,38,0.98);
          border: 2px solid rgba(240,200,50,0.7);
          box-shadow: 0 0 16px rgba(240,200,50,0.28), inset 0 0 12px rgba(240,200,50,0.10);
        }
        /* anel que respira, um por passo, em tempos diferentes */
        .sorteio-passo__anel {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(240,200,50,0.5);
          animation: sorteioAnel 3.2s ease-in-out infinite;
        }
        .sorteio-passo:nth-child(2) .sorteio-passo__anel { animation-delay: 0.45s; }
        .sorteio-passo:nth-child(3) .sorteio-passo__anel { animation-delay: 0.9s; }
        @keyframes sorteioAnel {
          0%, 62%, 100% { opacity: 0; transform: scale(0.92); }
          18%           { opacity: 0.75; transform: scale(1); }
          46%           { opacity: 0; transform: scale(1.22); }
        }
        .sorteio-passo__corpo { padding-top: 2px; }
        .sorteio-passo__titulo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #f0f0f0;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -.01em;
          margin-bottom: 4px;
        }
        .sorteio-passo__texto {
          margin: 0;
          color: rgba(240,240,240,0.62);
          font-size: 14.5px;
          line-height: 1.45;
        }

        /* ── QR ── */
        .sorteio-qr {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .sorteio-qr__moldura {
          position: relative;
          padding: 14px;
          border-radius: 20px;
          background: #ffffff;
          overflow: hidden;
          box-shadow: 0 18px 46px rgba(0,0,0,0.45), 0 0 34px rgba(240,200,50,0.22);
        }
        /* faixa de leitura passando pelo QR, como um scanner */
        .sorteio-qr__scan {
          position: absolute;
          left: 0;
          right: 0;
          height: 42%;
          background: linear-gradient(180deg,
                      rgba(240,200,50,0) 0%,
                      rgba(240,200,50,0.34) 55%,
                      rgba(240,200,50,0) 100%);
          animation: sorteioScan 3.4s cubic-bezier(0.45,0,0.55,1) infinite;
          pointer-events: none;
        }
        @keyframes sorteioScan {
          0%, 8%    { transform: translateY(-46%); opacity: 0; }
          18%       { opacity: 1; }
          62%       { opacity: 1; }
          72%, 100% { transform: translateY(240%); opacity: 0; }
        }
        .sorteio-qr__selo {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 9px 16px;
          border-radius: 99rem;
          background: rgba(35,60,100,0.5);
          border: 1px solid rgba(240,200,50,0.4);
          color: #f0c832;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* ── Faixa final ── */
        .sorteio-pronto {
          position: relative;
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 0 40px 34px;
          padding: 20px 26px;
          border-radius: 18px;
          overflow: hidden;
          background: linear-gradient(120deg, rgba(240,200,50,0.16) 0%, rgba(240,200,50,0.05) 60%, rgba(240,200,50,0.12) 100%);
          border: 1.5px solid rgba(240,200,50,0.45);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
        }
        /* brilho que atravessa a faixa de tempos em tempos */
        .sorteio-pronto__brilho {
          position: absolute;
          top: 0; bottom: 0; left: -40%;
          width: 38%;
          background: linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,240,180,0.22) 50%, rgba(255,255,255,0) 100%);
          animation: sorteioBrilho 5.2s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes sorteioBrilho {
          0%, 55%   { transform: translateX(0) skewX(-16deg); }
          85%, 100% { transform: translateX(420%) skewX(-16deg); }
        }
        .sorteio-pronto__titulo {
          margin: 0 0 2px;
          color: #f0c832;
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -.01em;
        }
        .sorteio-pronto__texto {
          margin: 0;
          color: rgba(240,240,240,0.66);
          font-size: 14.5px;
        }
      `}</style>
    </div>,
    modalRoot
  )
}
