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
