import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import PostCard from './PostCard'
import CategoryFilter from './CategoryFilter'

const CATEGORIES = ['전체', '디지털/가전', '의류/잡화', '가구/인테리어', '도서/문구', '스포츠/레저', '게임/취미', '식물', '기타']

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('posts')
    .select('id, title, price, category, status, created_at, user_id, image_url')
    .order('created_at', { ascending: false })

  if (category && category !== '전체') {
    query = query.eq('category', category)
  }

  const { data: posts } = await query

  const postIds = (posts ?? []).map(p => p.id)

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

  const enrichedPosts = (posts ?? []).map(p => ({
    ...p,
    likeCount: likeCount[p.id] ?? 0,
    commentCount: commentCount[p.id] ?? 0,
  }))

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8F5FF' }}>
      <Header user={user} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black" style={{ color: '#3B0764', letterSpacing: '-0.02em' }}>
            판매글 목록
          </h1>
          <span className="text-sm" style={{ color: '#A78BFA' }}>
            총 {enrichedPosts.length}개
          </span>
        </div>

        <CategoryFilter categories={CATEGORIES} selected={category ?? '전체'} />

        {enrichedPosts.length === 0 ? (
          <div
            className="mt-8 py-20 rounded-3xl text-center"
            style={{ background: 'white', border: '1px solid rgba(196,181,253,0.3)' }}
          >
            <p className="text-4xl mb-3">🛍️</p>
            <p className="font-semibold mb-1" style={{ color: '#5B21B6' }}>아직 판매글이 없어요</p>
            <p className="text-sm" style={{ color: '#A78BFA' }}>첫 번째 판매글을 올려보세요!</p>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {enrichedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
