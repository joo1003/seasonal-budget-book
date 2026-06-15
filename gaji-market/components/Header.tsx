'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import GajiLogo from './GajiLogo'

interface HeaderProps {
  user: User | null
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        background: 'linear-gradient(135deg, rgba(59,7,100,0.92) 0%, rgba(76,29,149,0.88) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <GajiLogo size={32} />
          <span className="text-lg font-bold text-white">
            가지마켓
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/posts"
            className="text-sm text-purple-200 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
          >
            둘러보기
          </Link>
          {user ? (
            <>
              <Link
                href="/sell"
                className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-all hover:opacity-90"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}
              >
                + 판매하기
              </Link>
              <Link
                href="/my"
                className="text-sm text-purple-200 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
              >
                마이페이지
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-purple-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-purple-200 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-all hover:opacity-90"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
