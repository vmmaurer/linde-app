import React from 'react'
import SlotMachine from './SlotMachine'

// ── Botão do Sorteio (canto superior direito, nas 4 telas) ──
// Casca de vidro com borda neon Sunshine em volta do caça-níquel animado
// (SlotMachine). O halo e o estouro de luz aqui acompanham o momento em que
// os três 7 alinham, no mesmo ciclo de 5,2s da arte.
//
// `label` aceita quebra de linha (\n) — cada linha vira uma linha do texto.

export default function SorteioButton({ onPress, label }) {
  return (
    <button
      className="sorteio-btn"
      aria-label={label ? String(label).replace(/\n/g, ' ') : 'Sorteio'}
      onPointerDown={onPress}
    >
      {/* Halo que pulsa junto com a premiação */}
      <span className="sorteio-halo" aria-hidden />
      {/* Estouro de luz no momento em que os três 7 alinham */}
      <span className="sorteio-flash" aria-hidden />

      <SlotMachine escala={label ? 1.28 : 1} />

      {label && (
        <span className="sorteio-label">
          {/* a quebra vem do próprio texto, então a frase parte sempre
              no mesmo lugar, sem depender da largura disponível */}
          {String(label).split('\n').map((linha, i) => (
            <span key={i}>{linha}</span>
          ))}
        </span>
      )}

      <style>{`
        .sorteio-btn {
          position: fixed;
          top: 44px;
          right: 44px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 116px;
          height: 116px;
          padding: 0;
          border-radius: 30px;
          background: linear-gradient(155deg, rgba(20,34,58,0.78) 0%, rgba(9,17,32,0.82) 100%);
          border: 2.5px solid rgba(240,200,50,0.62);
          box-shadow: 0 12px 34px rgba(0,0,0,0.45),
                      0 0 30px rgba(240,200,50,0.22),
                      inset 0 1px 1px rgba(255,255,255,0.14);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          cursor: pointer;
          touch-action: manipulation;
          transition: transform 0.18s cubic-bezier(0.22,1,0.36,1);
          animation: sorteioEntrada 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        .sorteio-btn:active { transform: scale(0.94); }

        /* Com legenda: o botão cresce, o ícone ganha destaque no topo e a
           frase fica embaixo em duas linhas centralizadas */
        .sorteio-btn:has(.sorteio-label) {
          width: auto;
          height: auto;
          padding: 26px 30px 22px;
          border-radius: 30px;
          gap: 18px;
        }
        .sorteio-btn:has(.sorteio-label) .slot-arte { margin: 4px 0; }
        .sorteio-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: .05em;
          line-height: 1.2;
          text-transform: uppercase;
          text-align: center;
          color: #f0c832;
          text-shadow: 0 0 10px rgba(240,200,50,0.35);
          white-space: nowrap;
        }

        .sorteio-halo {
          position: absolute;
          inset: -3px;
          border-radius: 33px;
          border: 2.5px solid rgba(240,200,50,0.75);
          pointer-events: none;
          animation: sorteioHalo 5.2s ease-in-out infinite;
        }
        .sorteio-flash {
          position: absolute;
          inset: -14px;
          border-radius: 42px;
          background: radial-gradient(circle at 50% 40%,
                      rgba(255,235,150,0.55) 0%,
                      rgba(240,200,50,0.30) 38%,
                      rgba(240,200,50,0) 70%);
          pointer-events: none;
          opacity: 0;
          animation: sorteioFlash 5.2s ease-out infinite;
        }

        @keyframes sorteioFlash {
          0%, 41%   { opacity: 0; transform: scale(0.92); }
          45%       { opacity: 1; transform: scale(1.04); }
          58%       { opacity: 0; transform: scale(1.2); }
          100%      { opacity: 0; transform: scale(0.92); }
        }
        @keyframes sorteioHalo {
          0%, 40%   { opacity: 0.22; transform: scale(1); }
          46%       { opacity: 0.95; transform: scale(1.055); }
          64%       { opacity: 0.22; transform: scale(1); }
          100%      { opacity: 0.22; transform: scale(1); }
        }
        @keyframes sorteioEntrada {
          from { opacity: 0; transform: translateY(-14px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </button>
  )
}
