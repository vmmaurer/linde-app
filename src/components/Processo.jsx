import React from 'react'

const steps = [
  {
    step: '01',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="#75c2ff" strokeWidth="1.5" opacity="0.3"/>
        <path d="M14 16H26M14 20H22M14 24H24" stroke="#75c2ff" strokeWidth="2" strokeLinecap="round"/>
        <rect x="10" y="12" width="20" height="16" rx="2" stroke="#75c2ff" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
    title: 'Pedido & Projeto',
    desc: 'Você nos apresenta o projeto ou necessidade. Nossa equipe técnica analisa e propõe as melhores soluções.',
  },
  {
    step: '02',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="#75c2ff" strokeWidth="1.5" opacity="0.3"/>
        <rect x="12" y="14" width="16" height="12" rx="1" stroke="#75c2ff" strokeWidth="1.5"/>
        <path d="M16 14V11M24 14V11M16 26V29M24 26V29" stroke="#75c2ff" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="3" stroke="#75c2ff" strokeWidth="1.5"/>
      </svg>
    ),
    title: 'Fabricação',
    desc: 'Corte, temperagem e tratamentos realizados com equipamentos de precisão. Controle de qualidade em cada etapa.',
  },
  {
    step: '03',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="#75c2ff" strokeWidth="1.5" opacity="0.3"/>
        <path d="M14 28L12 22L18 20L20 14L22 20L28 22L26 28H14Z" stroke="#75c2ff" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
        <path d="M20 14V10M10 20H6M30 20H34" stroke="#75c2ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
    title: 'Entrega',
    desc: 'Transporte especializado que garante a integridade de cada peça até o destino final.',
  },
  {
    step: '04',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="#75c2ff" strokeWidth="1.5" opacity="0.3"/>
        <path d="M13 20L17 24L27 16" stroke="#75c2ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Instalação',
    desc: 'Instalação realizada por equipe técnica certificada, com cuidado máximo e acabamento impecável.',
  },
]

export default function Processo() {
  return (
    <section
      className="relative py-28 px-6 md:px-12 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #040b19 0%, #040b19 50%, #040b19 100%)',
      }}
    >
      {/* Background lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 1px, transparent 1px, transparent 80px)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-glass-300 text-xs font-semibold tracking-[0.4em] uppercase mb-3">
            Do pedido à entrega
          </p>
          <h2 className="font-display text-5xl font-bold text-white mb-5">
            Nosso Processo
          </h2>
          <div className="w-16 h-0.5 bg-glass-400 mx-auto" />
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div
            className="absolute top-1/2 left-0 right-0 hidden lg:block pointer-events-none"
            style={{
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(117,194,255,0.25) 15%, rgba(117,194,255,0.25) 85%, transparent)',
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center relative">
                {/* Icon circle */}
                <div
                  className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center mb-6"
                  style={{
                    background: 'linear-gradient(145deg, rgba(1,52,136,0.9) 0%, rgba(1,28,107,0.95) 100%)',
                    border: '1.5px solid rgba(117,194,255,0.35)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                  }}
                >
                  {s.icon}
                  {/* Step number */}
                  <div
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: '#2ea4ff', color: 'white' }}
                  >
                    {i + 1}
                  </div>
                </div>

                <h3 className="text-white font-semibold text-xl mb-3">{s.title}</h3>
                <p className="text-white/55 text-base leading-relaxed max-w-52">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
