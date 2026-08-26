import React from 'react'

export default function Logo({ size = 'md', light = true }) {
  const sizes = {
    sm: { container: 'gap-2', icon: 36, titleSize: 'text-lg', subtitleSize: 'text-[10px]' },
    md: { container: 'gap-3', icon: 48, titleSize: 'text-2xl', subtitleSize: 'text-xs' },
    lg: { container: 'gap-4', icon: 64, titleSize: 'text-4xl', subtitleSize: 'text-sm' },
    xl: { container: 'gap-5', icon: 88, titleSize: 'text-5xl', subtitleSize: 'text-base' },
  }
  const s = sizes[size]
  const textColor = light ? 'text-white' : 'text-navy-900'
  const accentColor = light ? '#cf0f0f' : '#e01d1d'

  return (
    <div className={`flex items-center ${s.container} no-select`}>
      {/* Icon mark */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glass pane shape */}
        <rect
          x="8" y="8" width="48" height="48"
          rx="4"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          opacity="0.3"
        />
        {/* Main glass diamond */}
        <path
          d="M32 10 L54 32 L32 54 L10 32 Z"
          fill="none"
          stroke={accentColor}
          strokeWidth="2.5"
        />
        {/* Inner reflection lines */}
        <line x1="32" y1="10" x2="32" y2="54" stroke="white" strokeWidth="1" opacity="0.25" />
        <line x1="10" y1="32" x2="54" y2="32" stroke="white" strokeWidth="1" opacity="0.25" />
        {/* Center shine */}
        <circle cx="32" cy="32" r="5" fill={accentColor} opacity="0.9" />
        <circle cx="32" cy="32" r="2.5" fill="white" opacity="0.95" />
        {/* Reflection highlight */}
        <path
          d="M20 20 L28 16 L34 22"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
          fill="none"
        />
      </svg>

      {/* Text */}
      <div className="flex flex-col leading-tight">
        <span className={`${s.titleSize} font-display font-bold tracking-tight ${textColor}`}>
          Linde
        </span>
        <span
          className={`${s.subtitleSize} font-semibold tracking-[0.3em] uppercase`}
          style={{ color: accentColor }}
        >
          Vidros
        </span>
      </div>
    </div>
  )
}
