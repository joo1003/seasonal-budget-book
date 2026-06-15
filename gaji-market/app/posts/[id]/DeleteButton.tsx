'use client'

import { deletePost } from './actions'
import { useState } from 'react'

export default function DeleteButton({ postId }: { postId: string }) {
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  if (confirm) {
    return (
      <div className="flex-1 flex gap-2">
        <button
          onClick={async () => {
            setLoading(true)
            await deletePost(postId)
          }}
          disabled={loading}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '700',
            color: 'white',
            background: loading ? '#FCA5A5' : '#EF4444',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '삭제 중...' : '정말 삭제'}
        </button>
        <button
          onClick={() => setConfirm(false)}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '700',
            color: '#6B7280',
            background: '#F3F4F6',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          취소
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      style={{
        flex: 1,
        padding: '14px',
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '700',
        color: '#EF4444',
        background: '#FEF2F2',
        border: '1.5px solid rgba(239,68,68,0.2)',
        cursor: 'pointer',
      }}
    >
      삭제하기
    </button>
  )
}
