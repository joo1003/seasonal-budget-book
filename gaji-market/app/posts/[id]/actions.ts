'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function deletePost(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // 본인 글인지 확인
  const { data: post } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single()

  if (!post || post.user_id !== user.id) {
    throw new Error('삭제 권한이 없습니다.')
  }

  await supabase.from('posts').delete().eq('id', postId)
  redirect('/posts')
}

export async function updatePost(
  postId: string,
  data: { title: string; description: string; price: number; category: string }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // 본인 글인지 확인
  const { data: post } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single()

  if (!post || post.user_id !== user.id) {
    throw new Error('수정 권한이 없습니다.')
  }

  await supabase.from('posts').update(data).eq('id', postId)
  redirect(`/posts/${postId}`)
}
