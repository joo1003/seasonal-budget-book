'use client'

import { useState, useTransition } from 'react'
import { toggleLike } from './actions'

interface LikeButtonProps {
  postId: string
  initialCount: number
  initialLiked: boolean
  currentUserId: string | null
}

export default function LikeButton({ postId, initialCount, initialLiked, currentUserId }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!currentUserId) {
      alert('로그인 후 좋아요를 누를 수 있어요!')
      return
    }
    const nextLiked = !liked
    setLiked(nextLiked)
    setCount(c => nextLiked ? c + 1 : c - 1)

    startTransition(async () => {
      try {
        await toggleLike(postId)
      } catch {
        setLiked(liked)
        setCount(count)
      }
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 18px',
        borderRadius: '999px',
        fontSize: '14px',
        fontWeight: '700',
        border: liked ? '1.5px solid #EC4899' : '1.5px solid rgba(196,181,253,0.5)',
        background: liked ? '#FDF2F8' : '#F5F0FF',
        color: liked ? '#BE185D' : '#7C3AED',
        cursor: isPending ? 'default' : 'pointer',
        transition: 'all 0.15s',
      }}
    >
      <span style={{ fontSize: '16px' }}>{liked ? '❤️' : '🤍'}</span>
      <span>좋아요 {count}</span>
    </button>
  )
}
