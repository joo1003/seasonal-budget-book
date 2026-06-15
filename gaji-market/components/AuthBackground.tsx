import GajiLogo from './GajiLogo'
import Link from 'next/link'

export default function AuthBackground({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ backgroundColor: '#2D1558' }}
    >
      {/* 메시 그라디언트 배경 */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(ellipse at 15% 15%, rgba(167,139,250,0.5) 0%, transparent 50%),
          radial-gradient(ellipse at 85% 10%, rgba(99,102,241,0.4) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 85%, rgba(192,132,252,0.45) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 70%, rgba(139,92,246,0.35) 0%, transparent 45%)
        `
      }}/>

      {/* 로고 */}
      <Link href="/" className="relative flex flex-col items-center gap-1 mb-8 group">
        <div className="group-hover:scale-105 transition-transform duration-300 drop-shadow-xl">
          <GajiLogo size={72} />
        </div>
        <span className="text-2xl font-black text-white" style={{ letterSpacing: '-0.03em' }}>
          가지마켓
        </span>
      </Link>

      {/* 카드 — 글래스모피즘 */}
      <div className="relative w-full max-w-sm">
        {children}
      </div>

      <p className="relative mt-8 text-xs" style={{ color: 'rgba(196,181,253,0.7)' }}>우리 동네 이웃과 함께하는 중고거래 🛍️</p>
    </div>
  )
}
