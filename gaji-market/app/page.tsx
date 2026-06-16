import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import GajiLogo from '@/components/GajiLogo'
import Link from 'next/link'
import Image from 'next/image'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '방금 전'
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}시간 전`
  return `${Math.floor(hours / 24)}일 전`
}

const STATUS_LABEL: Record<string, { text: string; bg: string; color: string }> = {
  selling: { text: '판매중', bg: 'rgba(139,92,246,0.12)', color: '#7C3AED' },
  reserved: { text: '예약중', bg: 'rgba(251,191,36,0.15)', color: '#D97706' },
  sold: { text: '판매완료', bg: 'rgba(0,0,0,0.06)', color: 'rgba(100,80,130,0.5)' },
}

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 최신 판매글 3개
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('id, title, price, category, status, created_at, image_url')
    .order('created_at', { ascending: false })
    .limit(3)

  const postIds = (recentPosts ?? []).map(p => p.id)
  const [{ data: likes }, { data: comments }] = await Promise.all([
    postIds.length > 0
      ? supabase.from('likes').select('post_id').in('post_id', postIds)
      : Promise.resolve({ data: [] }),
    postIds.length > 0
      ? supabase.from('comments').select('post_id').in('post_id', postIds)
      : Promise.resolve({ data: [] }),
  ])

  const likeCount: Record<string, number> = {}
  for (const l of likes ?? []) likeCount[l.post_id] = (likeCount[l.post_id] ?? 0) + 1
  const commentCount: Record<string, number> = {}
  for (const c of comments ?? []) commentCount[c.post_id] = (commentCount[c.post_id] ?? 0) + 1

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EAFF' }}>
      <Header user={user} />

      {/* 배경 그라디언트 */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0" style={{ backgroundColor: '#F0EAFF' }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(ellipse at 15% 20%, rgba(216,180,254,0.55) 0%, transparent 50%),
            radial-gradient(ellipse at 85% 10%, rgba(196,181,253,0.45) 0%, transparent 50%),
            radial-gradient(ellipse at 55% 70%, rgba(233,213,255,0.5) 0%, transparent 55%),
            radial-gradient(ellipse at 10% 80%, rgba(245,208,254,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 55%, rgba(167,139,250,0.3) 0%, transparent 45%),
            radial-gradient(ellipse at 50% 40%, rgba(253,230,255,0.35) 0%, transparent 40%)
          `
        }} />
      </div>

      <main className="flex-1 relative" style={{ zIndex: 1 }}>

        {/* ① 히어로 */}
        <section className="pt-16 pb-10 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-5">
              <div className="drop-shadow-2xl hover:scale-105 transition-transform duration-300 cursor-default">
                <GajiLogo size={100} showLaptop={true} />
              </div>
            </div>
            <h1 className="text-5xl font-black mb-2" style={{ letterSpacing: '-0.03em', color: '#4C1D95' }}>
              가지마켓
            </h1>
            <p className="text-base font-medium" style={{ color: '#7C3AED', opacity: 0.85 }}>
              우리 동네 이웃과 함께하는 중고거래 🛍️
            </p>

            {user && (
              <div
                className="inline-block mt-5 px-5 py-2.5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(167,139,250,0.3)' }}
              >
                <p className="text-sm" style={{ color: '#6D28D9' }}>
                  환영합니다, <span className="font-bold" style={{ color: '#4C1D95' }}>{user.email}</span> 님! 🎉
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ② 빠른 메뉴 — 중앙 배치 */}
        <section className="px-4 pb-12">
          <div className="max-w-sm mx-auto flex flex-col items-center gap-3">
            {!user ? (
              <>
                <Link
                  href="/signup"
                  className="w-full py-4 font-bold rounded-2xl text-center text-base shadow-lg transition-all duration-200 hover:scale-105"
                  style={{ background: '#7C3AED', color: 'white' }}
                >
                  시작하기 →
                </Link>
                <Link
                  href="/login"
                  className="w-full py-3.5 font-semibold rounded-2xl text-center text-sm transition-all duration-200 hover:scale-105"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    color: '#6D28D9',
                    border: '1px solid rgba(167,139,250,0.4)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  로그인
                </Link>
              </>
            ) : (
              <div className="w-full flex gap-3">
                <Link
                  href="/posts"
                  className="flex-1 py-4 font-bold rounded-2xl text-center text-sm shadow-lg transition-all duration-200 hover:scale-105"
                  style={{ background: '#7C3AED', color: 'white' }}
                >
                  🛍️ 판매글 보기
                </Link>
                <Link
                  href="/posts/new"
                  className="flex-1 py-4 font-bold rounded-2xl text-center text-sm transition-all duration-200 hover:scale-105"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    color: '#6D28D9',
                    border: '1px solid rgba(167,139,250,0.4)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  + 판매하기
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ③ 최신 판매글 3개 */}
        {(recentPosts ?? []).length > 0 && (
          <>
            <div className="max-w-4xl mx-auto px-4">
              <div style={{ height: '1px', background: 'rgba(139,92,246,0.15)' }} />
            </div>
            <section className="py-12 px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold" style={{ letterSpacing: '-0.02em', color: '#4C1D95' }}>
                    최근 올라온 상품
                  </h2>
                  <Link
                    href="/posts"
                    className="text-xs font-semibold"
                    style={{ color: '#7C3AED' }}
                  >
                    전체 보기 →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(recentPosts ?? []).map(post => {
                    const status = STATUS_LABEL[post.status] ?? STATUS_LABEL.selling
                    return (
                      <Link key={post.id} href={`/posts/${post.id}`}>
                        <div
                          className="rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-200"
                          style={{
                            background: 'rgba(255,255,255,0.75)',
                            border: '1px solid rgba(167,139,250,0.25)',
                            backdropFilter: 'blur(12px)',
                            cursor: 'pointer',
                            boxShadow: '0 2px 16px rgba(139,92,246,0.08)',
                          }}
                        >
                          {/* 이미지 */}
                          <div
                            className="w-full relative flex items-center justify-center"
                            style={{ height: '160px', background: 'rgba(237,233,254,0.5)' }}
                          >
                            {post.image_url ? (
                              <Image
                                src={post.image_url}
                                alt={post.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 768px) 100vw, 33vw"
                              />
                            ) : (
                              <span style={{ fontSize: '48px' }}>🛍️</span>
                            )}
                            {post.status === 'sold' && (
                              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
                                <span className="text-white text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.6)' }}>판매완료</span>
                              </div>
                            )}
                          </div>

                          {/* 내용 */}
                          <div className="p-4">
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{ background: status.bg, color: status.color }}
                            >
                              {status.text}
                            </span>
                            <p className="mt-2 text-sm font-semibold leading-snug line-clamp-1" style={{ color: '#3B1B6E' }}>
                              {post.title}
                            </p>
                            <p className="mt-1 text-base font-black" style={{ color: '#7C3AED' }}>
                              {post.price.toLocaleString()}원
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs" style={{ color: 'rgba(109,40,217,0.5)' }}>
                                {timeAgo(post.created_at)}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs" style={{ color: 'rgba(109,40,217,0.5)' }}>
                                  🤍 {likeCount[post.id] ?? 0}
                                </span>
                                <span className="text-xs" style={{ color: 'rgba(109,40,217,0.5)' }}>
                                  💬 {commentCount[post.id] ?? 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </section>
          </>
        )}

        {/* ④ 기능 설명 카드 — 하단 */}
        <div className="max-w-4xl mx-auto px-4">
          <div style={{ height: '1px', background: 'rgba(139,92,246,0.15)' }} />
        </div>
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center text-xl font-bold mb-1.5" style={{ letterSpacing: '-0.02em', color: '#4C1D95' }}>
              왜 가지마켓인가요?
            </h2>
            <p className="text-center text-sm mb-8" style={{ color: 'rgba(109,40,217,0.6)' }}>이웃과 함께 만드는 따뜻한 거래 문화</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: '📍', title: '동네 직거래', desc: '가까운 이웃과 직거래로 안전하고 빠르게' },
                { icon: '💜', title: '믿을 수 있는', desc: '매너 온도로 신뢰할 수 있는 판매자 확인' },
                { icon: '💸', title: '합리적인 가격', desc: '새 상품보다 저렴하게, 필요한 것만 구매' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl p-6 text-center hover:-translate-y-1 transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.65)',
                    border: '1px solid rgba(167,139,250,0.25)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 2px 12px rgba(139,92,246,0.07)',
                  }}
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold mb-1.5 text-sm" style={{ color: '#4C1D95' }}>{item.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(109,40,217,0.65)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="relative py-6 text-center text-xs" style={{ zIndex: 1, color: 'rgba(109,40,217,0.5)', borderTop: '1px solid rgba(167,139,250,0.2)' }}>
        © 2026 가지마켓 · 개발 공부용 프로젝트
      </footer>
    </div>
  )
}
