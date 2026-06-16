import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Link from 'next/link'
import Image from 'next/image'
import DeleteButton from './DeleteButton'

const STATUS_LABEL: Record<string, { text: string; bg: string; color: string }> = {
  selling: { text: '판매중', bg: '#EDE9FE', color: '#6D28D9' },
  reserved: { text: '예약중', bg: '#FEF3C7', color: '#D97706' },
  sold: { text: '판매완료', bg: '#F3F4F6', color: '#9CA3AF' },
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '방금 전'
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!post) notFound()

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name, location')
    .eq('id', post.user_id)
    .single()

  const status = STATUS_LABEL[post.status] ?? STATUS_LABEL.selling
  const isOwner = user?.id === post.user_id

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8F5FF' }}>
      <Header user={user} />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <Link
          href="/posts"
          className="inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-70 transition-opacity"
          style={{ color: '#8B5CF6' }}
        >
          ← 목록으로
        </Link>

        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'white',
            boxShadow: '0 4px 24px rgba(109,40,217,0.08)',
            border: '1px solid rgba(196,181,253,0.2)',
          }}
        >
          {/* 이미지 영역 */}
          <div
            className="w-full relative flex items-center justify-center"
            style={{ height: '300px', background: '#F5F0FF' }}
          >
            {post.image_url ? (
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 672px) 100vw, 672px"
                priority
              />
            ) : (
              <span style={{ fontSize: '72px' }}>🛍️</span>
            )}
            {post.status === 'sold' && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.45)' }}
              >
                <span
                  className="text-white font-bold text-lg px-5 py-2 rounded-full"
                  style={{ background: 'rgba(0,0,0,0.6)' }}
                >
                  판매완료
                </span>
              </div>
            )}
          </div>

          <div className="p-6">
            {/* 상태 뱃지 + 카테고리 */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: status.bg, color: status.color }}
              >
                {status.text}
              </span>
              <span className="text-xs" style={{ color: '#C4B5FD' }}>
                {post.category}
              </span>
            </div>

            {/* 제목 */}
            <h1 className="text-xl font-black mb-2" style={{ color: '#3B0764', letterSpacing: '-0.02em' }}>
              {post.title}
            </h1>

            {/* 가격 */}
            <p className="text-2xl font-black mb-1" style={{ color: '#6D28D9' }}>
              {post.price.toLocaleString()}원
            </p>

            <p className="text-xs mb-6" style={{ color: '#C4B5FD' }}>
              {timeAgo(post.created_at)}
            </p>

            <div style={{ height: '1px', background: 'rgba(196,181,253,0.25)', marginBottom: '20px' }} />

            {/* 상품 설명 */}
            <h2 className="text-sm font-bold mb-3" style={{ color: '#5B21B6' }}>상품 정보</h2>
            <p
              className="text-sm leading-relaxed whitespace-pre-wrap mb-6"
              style={{ color: '#4C1D95' }}
            >
              {post.description}
            </p>

            <div style={{ height: '1px', background: 'rgba(196,181,253,0.25)', marginBottom: '20px' }} />

            {/* 판매자 정보 */}
            <h2 className="text-sm font-bold mb-3" style={{ color: '#5B21B6' }}>판매자 정보</h2>
            <div
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ background: '#F5F0FF' }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                style={{ background: '#7C3AED', color: 'white' }}
              >
                {(profile?.username ?? profile?.full_name ?? '?')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: '#3B0764' }}>
                  {profile?.username ?? profile?.full_name ?? '알 수 없음'}
                </p>
                {profile?.location && (
                  <p className="text-xs mt-0.5" style={{ color: '#A78BFA' }}>
                    📍 {profile.location}
                  </p>
                )}
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="mt-6 flex gap-3">
              {isOwner ? (
                <>
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="flex-1 py-3.5 rounded-2xl text-center text-sm font-bold transition-all hover:opacity-80"
                    style={{
                      background: '#F5F0FF',
                      color: '#6D28D9',
                      border: '1.5px solid rgba(196,181,253,0.5)',
                    }}
                  >
                    수정하기
                  </Link>
                  <DeleteButton postId={post.id} />
                </>
              ) : (
                <button
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '16px',
                    fontSize: '15px',
                    fontWeight: '700',
                    color: 'white',
                    background: post.status === 'sold'
                      ? '#D1D5DB'
                      : 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
                    border: 'none',
                    cursor: post.status === 'sold' ? 'not-allowed' : 'pointer',
                    boxShadow: post.status === 'sold' ? 'none' : '0 4px 20px rgba(109,40,217,0.3)',
                  }}
                  disabled={post.status === 'sold'}
                >
                  {post.status === 'sold' ? '판매 완료된 상품이에요' : '채팅으로 거래하기'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
