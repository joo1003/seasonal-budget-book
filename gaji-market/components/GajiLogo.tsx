'use client'

interface GajiLogoProps {
  size?: number
  showLaptop?: boolean
}

export default function GajiLogo({ size = 40, showLaptop: _showLaptop = false }: GajiLogoProps) {
  const overlayW = size * 0.65
  const overlayH = size * 0.42

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
      <span style={{ fontSize: size * 0.92, lineHeight: 1, display: 'block', userSelect: 'none' }}>🍆</span>

      <svg
        style={{
          position: 'absolute',
          top: '52%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: overlayW,
          height: overlayH,
          pointerEvents: 'none',
        }}
        viewBox="0 0 72 44"
        fill="none"
      >
        {/* 안경테 */}
        <circle cx="19" cy="16" r="12" fill="rgba(30,10,56,0.25)" stroke="#120820" strokeWidth="3"/>
        <circle cx="53" cy="16" r="12" fill="rgba(30,10,56,0.25)" stroke="#120820" strokeWidth="3"/>
        <path d="M31 16 L41 16" stroke="#120820" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M7 11 L1 9" stroke="#120820" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M65 11 L71 9" stroke="#120820" strokeWidth="2.5" strokeLinecap="round"/>

        {/* 눈 */}
        <circle cx="19" cy="16" r="6" fill="#1a0830"/>
        <circle cx="21" cy="13.5" r="2" fill="white"/>
        <circle cx="20.5" cy="18" r="1" fill="white" fillOpacity="0.6"/>
        <circle cx="53" cy="16" r="6" fill="#1a0830"/>
        <circle cx="55" cy="13.5" r="2" fill="white"/>
        <circle cx="54.5" cy="18" r="1" fill="white" fillOpacity="0.6"/>

        {/* 입 — 크게 아~! 신나는 표정 */}
        <ellipse cx="36" cy="37" rx="11" ry="8" fill="#0f0520"/>
        <ellipse cx="36" cy="36" rx="9" ry="6.5" fill="#be1863"/>
        <ellipse cx="36" cy="40" rx="9" ry="3" fill="#f472b6" fillOpacity="0.55"/>
        {/* 윗 이 */}
        <rect x="30" y="31" width="12" height="3.5" rx="1.5" fill="white" fillOpacity="0.92"/>
      </svg>
    </div>
  )
}
