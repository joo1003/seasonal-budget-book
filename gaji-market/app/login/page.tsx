'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AuthBackground from '@/components/AuthBackground'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <AuthBackground>
      <div className="rounded-3xl p-8" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }}>
        <h1 className="text-2xl font-black text-white mb-1" style={{ letterSpacing: '-0.02em' }}>로그인</h1>
        <p className="text-sm mb-7" style={{ color: 'rgba(221,214,254,0.8)' }}>다시 만나서 반가워요 👋</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'rgba(221,214,254,0.7)' }}>이메일</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all text-white placeholder-purple-300/50"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
              onFocus={e => { e.target.style.background = 'rgba(255,255,255,0.15)'; e.target.style.borderColor = 'rgba(196,181,253,0.6)' }}
              onBlur={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = 'rgba(255,255,255,0.15)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'rgba(221,214,254,0.7)' }}>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all text-white placeholder-purple-300/50"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
              onFocus={e => { e.target.style.background = 'rgba(255,255,255,0.15)'; e.target.style.borderColor = 'rgba(196,181,253,0.6)' }}
              onBlur={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = 'rgba(255,255,255,0.15)' }}
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-white font-bold rounded-xl transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}
          >
            {loading ? '로그인 중...' : '로그인 →'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'rgba(196,181,253,0.8)' }}>
          아직 계정이 없으신가요?{' '}
          <Link href="/signup" className="font-bold text-white hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </AuthBackground>
  )
}
