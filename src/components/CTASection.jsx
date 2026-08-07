import React from 'react'

// Tela CONTATO — background FUNDO-PAGINA-CONTATO.webp com véu azul

function QRCode() {
  return (
    <div
      className="relative inline-block rounded-2xl p-4"
      style={{ background: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
    >
      <img
        src="/images/qrcode_linktree_totem.webp"
        alt="QR Code para acessar o WhatsApp e o Instagram da Linde Vidros"
        className="object-contain"
        style={{ width: '200px', height: '200px' }}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
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
          'linear-gradient(180deg, rgba(4,11,25,0.55) 0%, rgba(35,60,100,0.30) 45%, rgba(4,11,25,0.75) 100%), url(/images/FUNDO-PAGINA-CONTATO.webp)',
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
            src="/images/logonavbar.webp"
            alt="Linde Vidros"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
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
        <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-6 max-w-xl">
          Quer trabalhar com a{' '}
          <span style={{ color: '#f0c832' }}>grife dos vidros</span>{' '}
          em seu negócio? Entre em contato agora mesmo.
        </h2>

        {/* Linha divisória — mesmo padrão usado abaixo dos títulos das outras abas */}
        <div style={{ width: 48, height: 2, background: '#f0c832', margin: '0 auto 32px', borderRadius: 2 }} />

        {/* Bloco de canais + QR */}
        <div className="flex flex-col items-center mb-8">
          {/* WhatsApp e Instagram */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center" style={{ gap: 8 }}>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ background: 'rgba(35,60,100,0.5)', border: '1px solid rgba(95,130,155,0.3)' }}
              >
                <img
                  src="/images/ICON_WHATS.webp"
                  alt="WhatsApp"
                  style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(35,60,100,0.5)', border: '1px solid rgba(240,200,50,0.35)' }}
              >
                <img
                  src="/images/ICON_INSTAGRAM.webp"
                  alt="Instagram"
                  style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            </div>
            <div className="text-left">
              <p style={{ color: '#f0c832' }} className="text-xs font-semibold tracking-wider uppercase">WhatsApp + Instagram</p>
              <p style={{ color: 'rgba(240,240,240,0.85)' }} className="text-sm font-medium">Um QR Code, dois caminhos para falar com a Linde</p>
            </div>
          </div>

          <QRCode />

          <p style={{ color: 'rgba(240,240,240,0.85)' }} className="text-sm font-medium mt-4">
            Escaneie, escolha seu canal e entre para o universo Linde
          </p>
        </div>

        {/* Linha divisória entre o bloco do QR e a região de atuação */}
        <div style={{ width: 48, height: 2, background: '#f0c832', margin: '0 auto 24px', borderRadius: 2 }} />

        {/* Região de atuação */}
        <p style={{ color: '#f0c832' }} className="text-lg md:text-xl font-medium mb-4">
          Confira nossa região de atuação:
        </p>

        <div style={{ width: '100%', maxWidth: '500px' }}>
          <video
            src="/images/REGIAO-4.webm"
            aria-label="Mapa de atuação Linde Vidros"
            style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto' }}
            autoPlay
            loop
            muted
            playsInline
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            disablePictureInPicture
          />
        </div>
      </div>
    </section>
  )
}
