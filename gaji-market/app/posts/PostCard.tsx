import Link from 'next/link'

interface Post {
  id: string
  title: string
  price: number
  category: string
  status: string
  created_at: string
  user_id: string
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

const STATUS_LABEL: Record<string, { text: string; bg: string; color: string }> = {
  selling: { text: '판매중', bg: '#EDE9FE', color: '#6D28D9' },
  reserved: { text: '예약중', bg: '#FEF3C7', color: '#D97706' },
  sold: { text: '판매완료', bg: '#F3F4F6', color: '#9CA3AF' },
}

export default function PostCard({ post }: { post: Post }) {
  const status = STATUS_LABEL[post.status] ?? STATUS_LABEL.selling

  return (
    <Link href={`/posts/${post.id}`}>
      <div
        className="rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-200"
        style={{
          background: 'white',
          border: '1px solid rgba(196,181,253,0.25)',
          boxShadow: '0 2px 12px rgba(109,40,217,0.06)',
          cursor: 'pointer',
        }}
      >
        {/* 이미지 자리 */}
        <div
          className="w-full flex items-center justify-center"
          style={{ height: '140px', background: '#F5F0FF' }}
        >
          <span style={{ fontSize: '40px' }}>🛍️</span>
        </div>

        {/* 내용 */}
        <div className="p-3">
          {/* 상태 뱃지 */}
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: status.bg, color: status.color }}
          >
            {status.text}
          </span>

          {/* 제목 */}
          <p
            className="mt-1.5 text-sm font-semibold leading-snug line-clamp-2"
            style={{ color: '#3B0764' }}
          >
            {post.title}
          </p>

          {/* 가격 */}
          <p className="mt-1 text-base font-black" style={{ color: '#6D28D9' }}>
            {post.price.toLocaleString()}원
          </p>

          {/* 카테고리 · 시간 */}
          <p className="mt-1 text-xs" style={{ color: '#C4B5FD' }}>
            {post.category} · {timeAgo(post.created_at)}
          </p>
        </div>
      </div>
    </Link>
  )
}
