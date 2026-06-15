'use client'

import { useState } from 'react'
import { updatePost } from '../actions'

const CATEGORIES = ['디지털/가전', '의류/잡화', '가구/인테리어', '도서/문구', '스포츠/레저', '게임/취미', '식물', '기타']

interface Post {
  id: string
  title: string
  description: string
  price: number
  category: string
}

export default function EditForm({ post }: { post: Post }) {
  const [title, setTitle] = useState(post.title)
  const [description, setDescription] = useState(post.description)
  const [price, setPrice] = useState(post.price.toLocaleString())
  const [category, setCategory] = useState(post.category)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!category) { setError('카테고리를 선택해주세요.'); return }
    setLoading(true)
    try {
      await updatePost(post.id, {
        title,
        description,
        price: parseInt(price.replace(/,/g, ''), 10),
        category,
      })
    } catch {
      setError('오류가 발생했어요. 다시 시도해주세요.')
      setLoading(false)
    }
  }

  const formatPrice = (value: string) => {
    const num = value.replace(/[^0-9]/g, '')
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '14px',
    border: '1.5px solid rgba(196,181,253,0.5)',
    background: 'white',
    fontSize: '15px',
    color: '#3B0764',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    display: 'block' as const,
    fontSize: '14px',
    fontWeight: '600' as const,
    marginBottom: '8px',
    color: '#5B21B6',
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <label style={labelStyle}>제목 *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={50}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#7C3AED')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(196,181,253,0.5)')}
        />
      </div>

      <div>
        <label style={labelStyle}>카테고리 *</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                border: '1.5px solid',
                cursor: 'pointer',
                transition: 'all 0.15s',
                borderColor: category === cat ? '#7C3AED' : 'rgba(196,181,253,0.5)',
                background: category === cat ? '#7C3AED' : 'white',
                color: category === cat ? 'white' : '#8B5CF6',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={labelStyle}>가격 *</label>
        <div className="relative">
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(formatPrice(e.target.value))}
            required
            style={{ ...inputStyle, paddingRight: '40px' }}
            onFocus={(e) => (e.target.style.borderColor = '#7C3AED')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(196,181,253,0.5)')}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: '#A78BFA' }}>
            원
          </span>
        </div>
      </div>

      <div>
        <label style={labelStyle}>상품 설명 *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={6}
          maxLength={1000}
          style={{ ...inputStyle, resize: 'vertical', minHeight: '140px', fontFamily: 'inherit', lineHeight: '1.6' }}
          onFocus={(e) => (e.target.style.borderColor = '#7C3AED')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(196,181,253,0.5)')}
        />
        <p className="text-right text-xs mt-1" style={{ color: '#C4B5FD' }}>{description.length} / 1000</p>
      </div>

      {error && (
        <p className="text-sm px-4 py-3 rounded-xl" style={{ background: '#FEE2E2', color: '#DC2626' }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '14px',
          borderRadius: '16px',
          fontSize: '16px',
          fontWeight: '700',
          color: 'white',
          background: loading ? 'rgba(109,40,217,0.5)' : 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: loading ? 'none' : '0 4px 20px rgba(109,40,217,0.3)',
        }}
      >
        {loading ? '저장 중...' : '수정 완료'}
      </button>
    </form>
  )
}
