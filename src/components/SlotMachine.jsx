import React from 'react'

// ── Caça-níquel animado (arte compartilhada) ──
// Usado no botão do canto superior direito e, em tamanho maior, no topo do
// pop-up do sorteio — é o que liga visualmente um ao outro.
//
// Ciclo de 5,2s em looping: a alavanca desce, os três rolos giram e param
// escalonados no 777, dá um flash e descansa. Tudo por transform/opacity,
// que o compositor resolve na GPU sem repintar — pode ficar rodando o dia
// inteiro no totem.

// A tira começa e termina em 7: o rolo descansa no 777, gira uma volta
// inteira e cai de novo no 777, sem salto na emenda. O dígito extra no fim
// é a folga para o rolo passar do ponto e voltar, como um de verdade.
const TIRA = [7, 2, 9, 4, 1, 6, 3, 8, 0, 5, 7, 2, 9, 4, 1, 6, 3, 8, 0, 5, 7, 2]

const ALTURA_DIGITO = 28
const PARADA = -20 * ALTURA_DIGITO

export default function SlotMachine({ escala = 1 }) {
  return (
    <span className="slot-arte" style={{ '--slot-escala': escala }} aria-hidden>
      <svg className="slot-coroa" viewBox="0 0 32 20" fill="none">
        <path
          d="M3.5 17.5V6.5l6 4.6L16 2.5l6.5 8.6 6-4.6v11z"
          stroke="#f0c832"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      <span className="slot-maquina">
        <span className="slot-reels">
          {[1, 2, 3].map((n) => (
            <span className="slot-reel" key={n}>
              <span className={`slot-tira slot-tira--${n}`}>
                {TIRA.map((d, i) => (
                  <span className="slot-digito" key={i}>{d}</span>
                ))}
              </span>
              {/* sombra de tambor: escurece topo e base da janelinha */}
              <span className="slot-tambor" />
            </span>
          ))}
        </span>
        <span className="slot-base" />
      </span>

      <span className="slot-alavanca">
        <span className="slot-haste" />
        <span className="slot-bola" />
      </span>

      <span className="slot-faisca slot-faisca--1" />
      <span className="slot-faisca slot-faisca--2" />
      <span className="slot-faisca slot-faisca--3" />

      <style>{`
        .slot-arte {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: scale(var(--slot-escala, 1));
        }
        .slot-coroa {
          width: 30px;
          height: 19px;
          margin-bottom: -2px;
          filter: drop-shadow(0 0 6px rgba(240,200,50,0.55));
          animation: slotCoroa 5.2s ease-out infinite;
        }
        .slot-maquina {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 5px;
          border-radius: 9px;
          border: 2px solid #f0c832;
          background: rgba(6,14,30,0.92);
          box-shadow: 0 0 12px rgba(240,200,50,0.45),
                      inset 0 0 10px rgba(240,200,50,0.10);
        }
        .slot-reels { display: flex; gap: 4px; }
        .slot-reel {
          position: relative;
          width: 14px;
          height: ${ALTURA_DIGITO}px;
          overflow: hidden;
          border-radius: 3px;
          background: rgba(0,0,0,0.55);
          box-shadow: inset 0 0 0 1px rgba(240,200,50,0.35);
        }
        .slot-tambor {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(180deg,
                      rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 34%,
                      rgba(0,0,0,0) 66%, rgba(0,0,0,0.85) 100%);
        }
        .slot-tira { display: block; will-change: transform; }
        .slot-digito {
          display: block;
          width: 14px;
          height: ${ALTURA_DIGITO}px;
          line-height: ${ALTURA_DIGITO}px;
          text-align: center;
          font-size: 17px;
          font-weight: 800;
          color: #f0c832;
          text-shadow: 0 0 8px rgba(240,200,50,0.55);
        }
        .slot-base {
          width: 34px;
          height: 4px;
          border-radius: 2px;
          background: rgba(240,200,50,0.85);
          box-shadow: 0 0 8px rgba(240,200,50,0.5);
        }

        .slot-alavanca {
          position: absolute;
          right: -13px;
          bottom: 12px;
          width: 11px;
          height: 30px;
          animation: slotAlavanca 5.2s cubic-bezier(0.3,0.9,0.4,1) infinite;
        }
        .slot-haste {
          position: absolute;
          left: 4px;
          bottom: 0;
          width: 3px;
          height: 22px;
          border-radius: 2px;
          background: rgba(240,200,50,0.9);
          box-shadow: 0 0 7px rgba(240,200,50,0.5);
        }
        .slot-bola {
          position: absolute;
          left: 0;
          top: 0;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: radial-gradient(circle at 34% 30%, #fff0b8 0%, #f0c832 55%, #c79a17 100%);
          box-shadow: 0 0 10px rgba(240,200,50,0.75);
        }

        .slot-faisca {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #ffe98a;
          box-shadow: 0 0 8px rgba(255,233,138,0.95);
          opacity: 0;
        }
        .slot-faisca--1 { left: -6px;  top: 20px; animation: slotFaisca 5.2s ease-out infinite; }
        .slot-faisca--2 { right: -4px; top: 8px;  animation: slotFaisca 5.2s ease-out infinite 0.08s; }
        .slot-faisca--3 { left: 22px;  top: -8px; animation: slotFaisca 5.2s ease-out infinite 0.16s; }

        /* ══ Ciclo de 5,2s ══
           0–7%    alavanca desce e volta
           7–31%   rolo 1 · 7–37% rolo 2 · 7–42% rolo 3
           42–58%  flash do 777
           58–100% descanso                                       */

        @keyframes slotAlavanca {
          0%, 2%    { transform: translateY(0); }
          6%        { transform: translateY(9px); }
          8%        { transform: translateY(9px); }
          15%       { transform: translateY(-2px); }
          20%, 100% { transform: translateY(0); }
        }
        @keyframes slotTira1 {
          0%, 6%   { transform: translateY(0);
                     animation-timing-function: cubic-bezier(0.45,0,0.85,0.4); }
          25%      { transform: translateY(${PARADA + 14}px);
                     animation-timing-function: cubic-bezier(0.25,0.9,0.35,1); }
          28%      { transform: translateY(${PARADA - 5}px); }
          31%      { transform: translateY(${PARADA}px); }
          100%     { transform: translateY(${PARADA}px); }
        }
        @keyframes slotTira2 {
          0%, 6%   { transform: translateY(0);
                     animation-timing-function: cubic-bezier(0.45,0,0.85,0.4); }
          30%      { transform: translateY(${PARADA + 14}px);
                     animation-timing-function: cubic-bezier(0.25,0.9,0.35,1); }
          34%      { transform: translateY(${PARADA - 5}px); }
          37%      { transform: translateY(${PARADA}px); }
          100%     { transform: translateY(${PARADA}px); }
        }
        @keyframes slotTira3 {
          0%, 6%   { transform: translateY(0);
                     animation-timing-function: cubic-bezier(0.45,0,0.85,0.4); }
          35%      { transform: translateY(${PARADA + 14}px);
                     animation-timing-function: cubic-bezier(0.25,0.9,0.35,1); }
          39%      { transform: translateY(${PARADA - 5}px); }
          42%      { transform: translateY(${PARADA}px); }
          100%     { transform: translateY(${PARADA}px); }
        }
        .slot-tira--1 { animation: slotTira1 5.2s infinite; }
        .slot-tira--2 { animation: slotTira2 5.2s infinite; }
        .slot-tira--3 { animation: slotTira3 5.2s infinite; }

        @keyframes slotCoroa {
          0%, 41%   { transform: translateY(0) scale(1); }
          46%       { transform: translateY(-3px) scale(1.14); }
          56%, 100% { transform: translateY(0) scale(1); }
        }
        @keyframes slotFaisca {
          0%, 42%  { opacity: 0; transform: scale(0.4); }
          47%      { opacity: 1; transform: scale(1.25); }
          57%      { opacity: 0; transform: scale(0.5); }
          100%     { opacity: 0; transform: scale(0.4); }
        }
      `}</style>
    </span>
  )
}
