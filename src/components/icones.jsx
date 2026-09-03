import React from 'react'

// ── Ícones do catálogo ──
// Traço fino, tamanho de celular. Ficam todos aqui para não espalhar SVG
// solto por quatro arquivos.

export const Lupa = ({ size = 19, cor = 'rgba(240,240,240,0.55)' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="8.8" cy="8.8" r="5.6" stroke={cor} strokeWidth="1.8" />
    <path d="M13 13L17 17" stroke={cor} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export const Xis = ({ size = 13, cor = 'rgba(240,240,240,0.8)' }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M3 3L11 11M11 3L3 11" stroke={cor} strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const Chevron = ({ size = 18, cor = '#f0c832', dir = 'direita' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    className="cat-item__seta"
    style={{ transform: dir === 'esquerda' ? 'rotate(180deg)' : 'none' }}
  >
    <path d="M7.5 4L13.5 10L7.5 16" stroke={cor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/** Marcador de local — usado na lista de aplicações. */
export const Marcador = ({ size = 16, cor = '#75c2ff' }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path
      d="M9 1.5c-2.9 0-5.25 2.35-5.25 5.25 0 3.94 5.25 9.75 5.25 9.75s5.25-5.81 5.25-9.75C14.25 3.85 11.9 1.5 9 1.5z"
      stroke={cor}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="6.75" r="1.9" stroke={cor} strokeWidth="1.6" />
  </svg>
)

/** Documento — botão e selo da ficha técnica. */
export const Documento = ({ size = 18, cor = '#f0c832' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
    <path
      d="M11.5 2H5.5A1.5 1.5 0 0 0 4 3.5v13A1.5 1.5 0 0 0 5.5 18h9a1.5 1.5 0 0 0 1.5-1.5V6.5L11.5 2Z"
      stroke={cor}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M11.5 2v4.5H16" stroke={cor} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M7 10.5h6M7 13.5h4" stroke={cor} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const Estrela = ({ size = 14, cor = '#f0c832' }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <path
      d="M9 1.6l1.9 4.3 4.7.5-3.5 3.2 1 4.6L9 11.9l-4.1 2.3 1-4.6L2.4 6.4l4.7-.5z"
      stroke={cor}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
)

/** Vidro sem resultado — usado na tela de busca vazia. */
export const SemResultado = ({ size = 46, cor = 'rgba(143,177,217,0.4)' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="7" y="7" width="34" height="34" rx="4" stroke={cor} strokeWidth="2" />
    <path d="M7 24h34M24 7v34" stroke={cor} strokeWidth="1.2" opacity="0.5" />
    <path d="M15 33L33 15" stroke={cor} strokeWidth="2" strokeLinecap="round" />
  </svg>
)
