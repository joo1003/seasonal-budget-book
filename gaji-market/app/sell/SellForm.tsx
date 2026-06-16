'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

const CATEGORIES = [
  '디지털/가전',
  '의류/잡화',
  '가구/인테리어',
  '도서/문구',
  '스포츠/레저',
  '게임/취미',
  '식물',
  '기타',
]

export default function SellForm({ userId }: { userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!category) {
      setError('카테고리를 선택해주세요.')
      return
    }

    setLoading(true)

    let image_url: string | null = null
    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `${userId}/${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(path, imageFile)

      if (uploadError) {
        setError('이미지 업로드에 실패했어요. 다시 시도해주세요.')
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(path)
      image_url = urlData.publicUrl
    }

    const { error: insertError } = await supabase.from('posts').insert({
      user_id: userId,
      title,
      description,
      price: parseInt(price.replace(/,/g, ''), 10),
      category,
      image_url,
    })

    setLoading(false)

    if (insertError) {
      setError('오류가 발생했어요. 다시 시도해주세요.')
      return
    }

    router.push('/posts')
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
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#5B21B6',
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* 이미지 업로드 */}
      <div>
        <label style={labelStyle}>상품 사진</label>
        {imagePreview ? (
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: '220px' }}>
            <Image
              src={imagePreview}
              alt="상품 미리보기"
              fill
              style={{ objectFit: 'cover' }}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: 'rgba(0,0,0,0.55)', color: 'white' }}
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-2 rounded-2xl transition-all"
            style={{
              height: '140px',
              border: '2px dashed rgba(196,181,253,0.6)',
              background: '#FAF7FF',
              color: '#A78BFA',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '32px' }}>📷</span>
            <span className="text-sm font-semibold">사진 추가하기</span>
            <span className="text-xs" style={{ color: '#C4B5FD' }}>JPG, PNG, WEBP · 최대 10MB</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* 제목 */}
      <div>
        <label style={labelStyle}>제목 *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="상품 제목을 입력해주세요"
          required
          maxLength={50}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#7C3AED')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(196,181,253,0.5)')}
        />
      </div>

      {/* 카테고리 */}
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

      {/* 가격 */}
      <div>
        <label style={labelStyle}>가격 *</label>
        <div className="relative">
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(formatPrice(e.target.value))}
            placeholder="0"
            required
            style={{ ...inputStyle, paddingRight: '40px' }}
            onFocus={(e) => (e.target.style.borderColor = '#7C3AED')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(196,181,253,0.5)')}
          />
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold"
            style={{ color: '#A78BFA' }}
          >
            원
          </span>
        </div>
      </div>

      {/* 설명 */}
      <div>
        <label style={labelStyle}>상품 설명 *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="상품 상태, 구매 시기, 사용감 등을 자세히 적어주세요"
          required
          rows={6}
          maxLength={1000}
          style={{
            ...inputStyle,
            resize: 'vertical',
            minHeight: '140px',
            fontFamily: 'inherit',
            lineHeight: '1.6',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#7C3AED')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(196,181,253,0.5)')}
        />
        <p className="text-right text-xs mt-1" style={{ color: '#C4B5FD' }}>
          {description.length} / 1000
        </p>
      </div>

      {error && (
        <p
          className="text-sm px-4 py-3 rounded-xl"
          style={{ background: '#FEE2E2', color: '#DC2626' }}
        >
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
          background: loading
            ? 'rgba(109,40,217,0.5)'
            : 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          boxShadow: loading ? 'none' : '0 4px 20px rgba(109,40,217,0.3)',
        }}
      >
        {loading ? '등록 중...' : '판매글 등록하기'}
      </button>
    </form>
  )
}
