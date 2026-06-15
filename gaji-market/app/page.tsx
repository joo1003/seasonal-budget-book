import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import GajiLogo from '@/components/GajiLogo'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#1E0D47' }}>
      <Header user={user} />

      {/* 전체 페이지 공통 배경 — 메시 그라디언트 */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0" style={{ backgroundColor: '#1E0D47' }}/>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(ellipse at 15% 20%, rgba(167,139,250,0.45) 0%, transparent 50%),
            radial-gradient(ellipse at 85% 10%, rgba(99,102,241,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 55% 70%, rgba(192,132,252,0.35) 0%, transparent 55%),
            radial-gradient(ellipse at 10% 75%, rgba(109,40,217,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 60%, rgba(139,92,246,0.3) 0%, transparent 45%)
          `
        }}/>
      </div>

      <main className="flex-1 relative" style={{ zIndex: 1 }}>

        {/* 히어로 섹션 */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">

            {/* 노트북과 함께하는 개발자 가지 캐릭터 */}
            <div className="flex justify-center mb-6">
              <div className="drop-shadow-2xl hover:scale-105 transition-transform duration-300 cursor-default">
                <GajiLogo size={110} showLaptop={true} />
              </div>
            </div>

            <h1 className="text-5xl font-black text-white mb-3" style={{ letterSpacing: '-0.03em' }}>
              가지마켓
            </h1>
            <p className="text-purple-200 text-base mb-10 font-medium" style={{ opacity: 0.85 }}>
              우리 동네 이웃과 함께하는 중고거래 🛍️
            </p>

            {!user ? (
              <div className="flex gap-3 justify-center">
                <Link
                  href="/signup"
                  className="px-8 py-3.5 font-bold rounded-2xl shadow-lg transition-all duration-200 hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.95)', color: '#6D28D9' }}
                >
                  시작하기 →
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-3.5 font-semibold rounded-2xl transition-all duration-200 hover:scale-105"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  로그인
                </Link>
              </div>
            ) : (
              <div
                className="inline-block px-6 py-3 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <p className="text-purple-200 text-sm">
                  환영합니다, <span className="font-bold text-white">{user.email}</span> 님! 🎉
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 구분선 */}
        <div className="max-w-4xl mx-auto px-4">
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }}/>
        </div>

        {/* 특징 섹션 */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center text-2xl font-bold mb-1.5 text-white" style={{ letterSpacing: '-0.02em' }}>
              왜 가지마켓인가요?
            </h2>
            <p className="text-center text-sm mb-12" style={{ color: 'rgba(196,181,253,0.7)' }}>이웃과 함께 만드는 따뜻한 거래 문화</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: '📍', title: '동네 직거래', desc: '가까운 이웃과 직거래로 안전하고 빠르게' },
                { icon: '💜', title: '믿을 수 있는', desc: '매너 온도로 신뢰할 수 있는 판매자 확인' },
                { icon: '💸', title: '합리적인 가격', desc: '새 상품보다 저렴하게, 필요한 것만 구매' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl p-7 text-center hover:-translate-y-1 transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="font-bold mb-2 text-base text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(196,181,253,0.75)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 구분선 */}
        <div className="max-w-4xl mx-auto px-4">
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }}/>
        </div>

        {/* CTA 배너 */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div
              className="rounded-3xl p-10 text-center relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full" style={{ background: 'rgba(139,92,246,0.15)' }}/>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full" style={{ background: 'rgba(167,139,250,0.1)' }}/>
              <div className="relative">
                <p className="text-4xl mb-3">🛍️</p>
                <h2 className="text-xl font-bold text-white mb-2">지금 바로 둘러보세요</h2>
                <p className="text-sm mb-6" style={{ color: 'rgba(196,181,253,0.75)' }}>
                  이웃들이 올린 다양한 중고 상품을 확인해보세요
                </p>
                <Link
                  href="/posts"
                  className="inline-block px-8 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.95)', color: '#6D28D9' }}
                >
                  판매글 보러가기 →
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="relative py-6 text-center text-xs" style={{ zIndex: 1, color: 'rgba(167,139,250,0.6)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        © 2026 가지마켓 · 개발 공부용 프로젝트
      </footer>
    </div>
  )
}
