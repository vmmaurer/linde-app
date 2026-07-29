import React from 'react'

// Tela CONTATO — background FUNDO-PAGINA-CONTATO.png com véu azul

function QRCode() {
  return (
    <div
      className="relative inline-block rounded-2xl p-4"
      style={{ background: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
    >
      <img
        src="/images/qrcode_whatsapp_linde_mensagem.png"
        alt="QR Code WhatsApp Linde Vidros"
        className="object-contain"
        style={{ width: '180px', height: '180px' }}
      />
    </div>
  )
}

export default function CTASection() {
  return (
    <section
      className="relative px-6 md:px-12"
      style={{
        /* Fundo: imagem do Contato (já vem com azul embutido) + véu leve */
        backgroundImage:
          'linear-gradient(180deg, rgba(4,11,25,0.55) 0%, rgba(35,60,100,0.30) 45%, rgba(4,11,25,0.75) 100%), url(/images/FUNDO-PAGINA-CONTATO.png)',
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
        minHeight: '100%',
        width: '100%',
        boxSizing: 'border-box',
        paddingTop: 0,
        paddingBottom: '160px',
      }}
    >
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center text-center">

        {/* Logo Linde 60 anos — topo */}
        <div className="brand-masthead" style={{ marginBottom: 28 }}>
          <img
            className="brand-masthead__logo"
            src="/images/logonavbar.png"
            alt="Linde Vidros"
          />
        </div>

        {/* Tag — Sunshine */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
          style={{
            background: 'rgba(240,200,50,0.12)',
            border: '1px solid rgba(240,200,50,0.35)',
            color: '#f0c832',
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f0c832', animation: 'pulse 2s infinite' }} />
          Fale com a Linde Vidros
        </div>

        {/* Título com destaque em "grife dos vidros" */}
        <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-8 max-w-xl">
          Quer trabalhar com a{' '}
          <span style={{ color: '#f0c832' }}>grife dos vidros</span>{' '}
          em seu negócio? Entre em contato agora mesmo.
        </h2>

        {/* Bloco WhatsApp + QR */}
        <div className="flex flex-col items-center mb-10">
          {/* WhatsApp header */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
              style={{ background: 'rgba(35,60,100,0.5)', border: '1px solid rgba(95,130,155,0.3)' }}
            >
              <img
                src="/images/ICON_WHATS.png"
                alt="WhatsApp"
                style={{ width: '28px', height: '28px', objectFit: 'contain' }}
              />
            </div>
            <div className="text-left">
              <p style={{ color: '#5f829b' }} className="text-xs font-medium tracking-wider uppercase">WhatsApp</p>
              <p style={{ color: 'rgba(240,240,240,0.85)' }} className="text-sm font-medium">Acesse pelo QR Code abaixo</p>
            </div>
          </div>

          <QRCode />

          <p style={{ color: '#f0c832' }} className="text-sm font-medium mt-3">
            Escaneie e entre em contato
          </p>
        </div>

        {/* Região de atuação */}
        <p style={{ color: 'rgba(240,240,240,0.85)' }} className="text-lg md:text-xl font-medium mb-4">
          Confira nossa região de atuação:
        </p>

        <div style={{ width: '100%', maxWidth: '500px' }}>
          <img
            src="/images/REGIÃO.gif"
            alt="Mapa de atuação Linde Vidros"
            style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto' }}
          />
        </div>
      </div>
    </section>
  )
}
