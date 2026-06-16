'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updatePost } from '../actions'
import Image from 'next/image'

const CATEGORIES = ['디지털/가전', '의류/잡화', '가구/인테리어', '도서/문구', '스포츠/레저', '게임/취미', '식물', '기타']

interface Post {
  id: string
  user_id: string
  title: string
  description: string
  price: number
  category: string
  image_url?: string | null
}

export default function EditForm({ post }: { post: Post }) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(post.title)
  const [description, setDescription] = useState(post.description)
  const [price, setPrice] = useState(post.price.toLocaleString())
  const [category, setCategory] = useState(post.category)

  // 이미지 상태
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(post.image_url ?? null)
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setNewImageFile(file)
    setNewImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setCurrentImageUrl(null)
    setNewImageFile(null)
    setNewImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const displayImage = newImagePreview ?? currentImageUrl

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!category) { setError('카테고리를 선택해주세요.'); return }
    setLoading(true)

    try {
      let image_url: string | null | undefined = undefined

      if (newImageFile) {
        // 새 이미지 업로드
        const ext = newImageFile.name.split('.').pop()
        const path = `${post.user_id}/${crypto.randomUUID()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(path, newImageFile)

        if (uploadError) {
          setError('이미지 업로드에 실패했어요. 다시 시도해주세요.')
          setLoading(false)
          return
        }

        const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(path)
        image_url = urlData.publicUrl
      } else if (currentImageUrl === null && post.image_url) {
        // 이미지 삭제 요청
        image_url = null
      }

      const updateData: Parameters<typeof updatePost>[1] = {
        title,
        description,
        price: parseInt(price.replace(/,/g, ''), 10),
        category,
      }

      if (image_url !== undefined) {
        updateData.image_url = image_url
      }

      await updatePost(post.id, updateData)
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

      {/* 이미지 */}
      <div>
        <label style={labelStyle}>상품 사진</label>
        {displayImage ? (
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: '220px' }}>
            <Image
              src={displayImage}
              alt="상품 이미지"
              fill
              style={{ objectFit: 'cover' }}
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(0,0,0,0.55)', color: 'white' }}
              >
                교체
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: 'rgba(0,0,0,0.55)', color: 'white' }}
              >
                ✕
              </button>
            </div>
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
