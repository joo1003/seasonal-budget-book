import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Header from '@/components/Header'
import EditForm from './EditForm'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!post) notFound()

  // 본인 글이 아니면 접근 차단
  if (post.user_id !== user.id) redirect(`/posts/${id}`)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8F5FF' }}>
      <Header user={user} />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <h1 className="text-2xl font-black mb-8" style={{ color: '#3B0764', letterSpacing: '-0.02em' }}>
          판매글 수정
        </h1>
        <EditForm post={post} />
      </main>
    </div>
  )
}
