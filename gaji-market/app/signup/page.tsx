'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AuthBackground from '@/components/AuthBackground'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${location.origin}/`,
      },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        setError('이미 사용 중인 이메일입니다.')
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <AuthBackground>
        <div className="bg-white rounded-3xl shadow-xl shadow-purple-100 p-8 border border-purple-50 text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">메일함을 확인해주세요!</h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-7">
            <span className="font-semibold text-gray-700">{email}</span>로<br />
            인증 링크를 보냈어요.<br />
            링크를 클릭하면 가입이 완료됩니다 ✉️
          </p>
          <Link
            href="/login"
            className="inline-block w-full py-3.5 text-white font-bold rounded-xl text-center transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-200"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}
          >
            로그인하러 가기 →
          </Link>
        </div>
      </AuthBackground>
    )
  }

  return (
    <AuthBackground>
      <div className="rounded-3xl p-8" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }}>
        <h1 className="text-2xl font-black text-white mb-1" style={{ letterSpacing: '-0.02em' }}>회원가입</h1>
        <p className="text-sm mb-7" style={{ color: 'rgba(221,214,254,0.8)' }}>가지마켓에 오신 걸 환영해요 🍆</p>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'rgba(221,214,254,0.7)' }}>닉네임</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="동네 이웃들에게 보여질 이름"
              required
              minLength={2}
              maxLength={20}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all text-white"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
              onFocus={e => { e.target.style.background = 'rgba(255,255,255,0.15)'; e.target.style.borderColor = 'rgba(196,181,253,0.6)' }}
              onBlur={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = 'rgba(255,255,255,0.15)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'rgba(221,214,254,0.7)' }}>이메일</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all text-white"
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
              placeholder="6자 이상 입력하세요"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all text-white"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
              onFocus={e => { e.target.style.background = 'rgba(255,255,255,0.15)'; e.target.style.borderColor = 'rgba(196,181,253,0.6)' }}
              onBlur={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = 'rgba(255,255,255,0.15)' }}
            />
          </div>

          {error && (
            <div className="text-sm px-4 py-3 rounded-xl" style={{ color: '#FCA5A5', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 font-bold rounded-xl transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-1 text-white"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}
          >
            {loading ? '처리 중...' : '가입하기 →'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'rgba(196,181,253,0.8)' }}>
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="font-bold text-white hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </AuthBackground>
  )
}
