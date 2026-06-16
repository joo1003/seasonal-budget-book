import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get('postId')
  if (!postId) return NextResponse.json([], { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: comments, error } = await supabase
    .from('comments')
    .select('id, content, created_at, updated_at, user_id, parent_id, profiles(username, full_name)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json([], { status: 500 })

  const commentIds = (comments ?? []).map(c => c.id)
  if (commentIds.length === 0) return NextResponse.json([])

  const { data: likes } = await supabase
    .from('comment_likes')
    .select('comment_id, user_id')
    .in('comment_id', commentIds)

  const likeCount: Record<string, number> = {}
  const userLiked = new Set<string>()
  for (const like of likes ?? []) {
    likeCount[like.comment_id] = (likeCount[like.comment_id] ?? 0) + 1
    if (like.user_id === user?.id) userLiked.add(like.comment_id)
  }

  const enriched = (comments ?? []).map(c => ({
    ...c,
    like_count: likeCount[c.id] ?? 0,
    liked_by_me: userLiked.has(c.id),
  }))

  return NextResponse.json(enriched)
}
