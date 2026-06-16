'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function extractStoragePath(imageUrl: string): string | null {
  try {
    const marker = '/post-images/'
    const idx = imageUrl.indexOf(marker)
    if (idx === -1) return null
    return imageUrl.slice(idx + marker.length)
  } catch {
    return null
  }
}

export async function deletePost(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: post } = await supabase
    .from('posts')
    .select('user_id, image_url')
    .eq('id', postId)
    .single()

  if (!post || post.user_id !== user.id) {
    throw new Error('삭제 권한이 없습니다.')
  }

  if (post.image_url) {
    const path = extractStoragePath(post.image_url)
    if (path) {
      await supabase.storage.from('post-images').remove([path])
    }
  }

  await supabase.from('posts').delete().eq('id', postId)
  redirect('/posts')
}

export async function addReply(postId: string, parentId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const trimmed = content.trim()
  if (!trimmed) throw new Error('댓글 내용을 입력해주세요.')

  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    user_id: user.id,
    parent_id: parentId,
    content: trimmed,
  })
  if (error) throw new Error('답글 작성에 실패했습니다.')
}

export async function toggleCommentLike(commentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: existing } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    await supabase.from('comment_likes').delete().eq('id', existing.id)
  } else {
    await supabase.from('comment_likes').insert({ comment_id: commentId, user_id: user.id })
  }
}

export async function addComment(postId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const trimmed = content.trim()
  if (!trimmed) throw new Error('댓글 내용을 입력해주세요.')

  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    user_id: user.id,
    content: trimmed,
  })
  if (error) throw new Error('댓글 작성에 실패했습니다.')
}

export async function updateComment(commentId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const trimmed = content.trim()
  if (!trimmed) throw new Error('댓글 내용을 입력해주세요.')

  const { error } = await supabase
    .from('comments')
    .update({ content: trimmed })
    .eq('id', commentId)
    .eq('user_id', user.id)
  if (error) throw new Error('댓글 수정에 실패했습니다.')
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id)
  if (error) throw new Error('댓글 삭제에 실패했습니다.')
}

export async function toggleLike(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    await supabase.from('likes').delete().eq('id', existing.id)
  } else {
    await supabase.from('likes').insert({ post_id: postId, user_id: user.id })
  }
}

export async function updatePost(
  postId: string,
  data: { title: string; description: string; price: number; category: string; image_url?: string | null }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: post } = await supabase
    .from('posts')
    .select('user_id, image_url')
    .eq('id', postId)
    .single()

  if (!post || post.user_id !== user.id) {
    throw new Error('수정 권한이 없습니다.')
  }

  // 이미지가 바뀐 경우 기존 이미지 삭제
  if ('image_url' in data && data.image_url !== post.image_url && post.image_url) {
    const path = extractStoragePath(post.image_url)
    if (path) {
      await supabase.storage.from('post-images').remove([path])
    }
  }

  await supabase.from('posts').update(data).eq('id', postId)
  redirect(`/posts/${postId}`)
}
