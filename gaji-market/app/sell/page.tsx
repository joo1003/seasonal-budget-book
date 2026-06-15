import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import SellForm from './SellForm'

export default async function SellPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8F5FF' }}>
      <Header user={user} />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <h1 className="text-2xl font-black mb-8" style={{ color: '#3B0764', letterSpacing: '-0.02em' }}>
          판매글 작성
        </h1>
        <SellForm userId={user.id} />
      </main>
    </div>
  )
}
