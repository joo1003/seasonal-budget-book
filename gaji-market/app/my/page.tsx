import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'

export default async function MyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <h1 className="text-xl font-bold text-gray-900 mb-6">마이페이지</h1>

        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl text-white font-bold"
              style={{ background: 'linear-gradient(135deg, var(--gaji-dark), var(--gaji-purple-light))' }}
            >
              {profile?.username?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{profile?.username ?? '닉네임 없음'}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
            {[
              { label: '판매 중', value: '0' },
              { label: '거래 완료', value: '0' },
              { label: '관심 목록', value: '0' },
            ].map(item => (
              <div key={item.label}>
                <p className="text-lg font-bold text-gray-900">{item.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 메뉴 리스트 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
          {[
            { icon: '📦', label: '내 판매 상품' },
            { icon: '❤️', label: '관심 목록' },
            { icon: '💬', label: '채팅 목록' },
            { icon: '⭐', label: '받은 후기' },
            { icon: '⚙️', label: '계정 설정' },
          ].map(item => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors text-sm text-gray-700"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              <span className="ml-auto text-gray-300">›</span>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          서비스 준비 중인 기능들이 있습니다 🚧
        </p>
      </main>
    </div>
  )
}
