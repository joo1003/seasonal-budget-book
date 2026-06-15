'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function CategoryFilter({
  categories,
  selected,
}: {
  categories: string[]
  selected: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSelect = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (cat === '전체') {
      params.delete('category')
    } else {
      params.set('category', cat)
    }
    router.push(`/posts?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isSelected = cat === selected || (cat === '전체' && selected === '전체')
        return (
          <button
            key={cat}
            onClick={() => handleSelect(cat)}
            style={{
              padding: '7px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              border: '1.5px solid',
              cursor: 'pointer',
              transition: 'all 0.15s',
              borderColor: isSelected ? '#7C3AED' : 'rgba(196,181,253,0.5)',
              background: isSelected ? '#7C3AED' : 'white',
              color: isSelected ? 'white' : '#8B5CF6',
            }}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
