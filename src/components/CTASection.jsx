import React from 'react'

// ── Paleta: Sapphire #233c64 · Cold Steel #5f829b · Sunshine #f0c832

function QRCode() {
  return (
    <div
      className="relative inline-block rounded-2xl p-4"
      style={{
        background: 'white',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}
    >
      <img
        src="/images/qrcode_whatsapp_linde_mensagem.png"
        alt="QR Code WhatsApp Linde Vidros"
        className="object-contain"
        style={{ width: '240px', height: '240px' }}
      />
    </div>
  )
}

export default function CTASection() {
  return (
    <section
      className="relative px-6 md:px-12"
      style={{
        background: 'linear-gradient(180deg, #040b19 0%, #233c64 50%, #040b19 100%)',
        minHeight: '100%',
        width: '100%',
        boxSizing: 'border-box',
        paddingTop: '2cm',        /* margem no topo */
        paddingBottom: '100px',
      }}
    >
      {/* Ambient lights — Cold Steel */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 50% at 20% 50%, rgba(95,130,155,0.15) 0%, transparent 70%)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 60% at 80% 50%, rgba(35,60,100,0.2) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center">

        {/* Logo — no topo */}
        <img
          src="/images/logonavbar.png"
          alt="Linde Vidros"
          style={{ height: '200px', width: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto 24px' }}
        />

        {/* Tag — Sunshine */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
          style={{
            background: 'rgba(240,200,50,0.12)',
            border: '1px solid rgba(240,200,50,0.35)',
            color: '#f0c832',
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f0c832', animation: 'pulse 2s infinite' }} />
          Fale com a Linde Vidros
        </div>

        {/* Título */}
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
          Transforme seu projeto em realidade
        </h2>

        <p style={{ color: 'rgba(240,240,240,0.55)' }} className="text-lg leading-relaxed mb-8 max-w-2xl">
          Nossa equipe de especialistas está pronta para desenvolver a solução em vidro ideal para o seu projeto,
          com qualidade e precisão que você pode confiar.
        </p>

        {/* ── WhatsApp ── */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{ background: 'rgba(35,60,100,0.5)', border: '1px solid rgba(95,130,155,0.3)' }}
          >
            <img
              src="/images/ICON_WHATS.png"
              alt="WhatsApp"
              style={{ width: '32px', height: '32px', objectFit: 'contain' }}
            />
          </div>
          <div className="text-left">
            <p style={{ color: '#5f829b' }} className="text-xs font-medium tracking-wider uppercase">WhatsApp</p>
            <p style={{ color: 'rgba(240,240,240,0.85)' }} className="text-base font-medium">Acesse pelo QR Code abaixo</p>
          </div>
        </div>

        {/* QR Code — logo abaixo do WhatsApp */}
        <QRCode />
        <p style={{ color: '#f0c832' }} className="text-base font-medium mt-3 mb-8">
          Escaneie e entre em contato
        </p>

        {/* ── Mapa de Atuação ── */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'rgba(35,60,100,0.5)', border: '1px solid rgba(95,130,155,0.3)' }}
          >
            📍
          </div>
          <div className="text-left">
            <p style={{ color: '#5f829b' }} className="text-xs font-medium tracking-wider uppercase">Mapa de Atuação</p>
          </div>
        </div>

        {/* Mapa GIF — abaixo do texto Mapa de Atuação */}
        <div style={{ width: '100%', maxWidth: '340px', marginBottom: '24px' }}>
          <img
            src="/images/REGIÃO.gif"
            alt="Mapa de atuação Linde Vidros"
            style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto' }}
          />
        </div>

        {/* Rodapé */}
        <p style={{ color: 'rgba(95,130,155,0.5)' }} className="text-xs font-medium tracking-[0.25em] uppercase text-center mt-1">
          Soluções em vidro de alto padrão
        </p>
      </div>
    </section>
  )
}