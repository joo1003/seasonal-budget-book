'use client'

import { useState, useTransition } from 'react'
import { addComment, addReply, updateComment, deleteComment, toggleCommentLike } from './actions'

type Comment = {
  id: string
  content: string
  created_at: string
  updated_at: string
  user_id: string
  parent_id: string | null
  like_count: number
  liked_by_me: boolean
  profiles: { username: string | null; full_name: string | null } | null
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '방금 전'
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}시간 전`
  return `${Math.floor(hours / 24)}일 전`
}

function displayName(c: Comment) {
  return c.profiles?.username ?? c.profiles?.full_name ?? '익명'
}

// 댓글 하나를 렌더링하는 컴포넌트 (댓글 + 대댓글 공용)
function CommentItem({
  comment,
  currentUserId,
  postId,
  isReply,
  onRefresh,
}: {
  comment: Comment
  currentUserId: string | null
  postId: string
  isReply: boolean
  onRefresh: () => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [liked, setLiked] = useState(comment.liked_by_me)
  const [likeCount, setLikeCount] = useState(comment.like_count)
  const [isPending, startTransition] = useTransition()

  const isOwner = currentUserId === comment.user_id
  const name = displayName(comment)

  function handleLike() {
    if (!currentUserId) {
      alert('로그인 후 좋아요를 누를 수 있어요!')
      return
    }
    const next = !liked
    setLiked(next)
    setLikeCount(c => next ? c + 1 : c - 1)
    startTransition(async () => {
      try {
        await toggleCommentLike(comment.id)
      } catch {
        setLiked(liked)
        setLikeCount(likeCount)
      }
    })
  }

  function handleDelete() {
    if (!confirm('댓글을 삭제할까요?')) return
    startTransition(async () => {
      try {
        await deleteComment(comment.id)
        onRefresh()
      } catch {}
    })
  }

  function handleUpdate() {
    if (!editContent.trim()) return
    startTransition(async () => {
      try {
        await updateComment(comment.id, editContent)
        onRefresh()
        setEditingId(null)
      } catch {}
    })
  }

  function handleReply() {
    if (!replyContent.trim()) return
    startTransition(async () => {
      try {
        await addReply(postId, comment.id, replyContent)
        setReplyContent('')
        setShowReplyForm(false)
        onRefresh()
      } catch {}
    })
  }

  return (
    <div>
      <div className="flex items-start gap-3">
        {/* 아바타 */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{ background: isReply ? '#A78BFA' : '#7C3AED', color: 'white' }}
        >
          {name[0].toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          {/* 이름 + 시간 */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold" style={{ color: '#3B0764' }}>{name}</span>
            <span className="text-xs" style={{ color: '#C4B5FD' }}>
              {timeAgo(comment.created_at)}
              {comment.updated_at !== comment.created_at && ' (수정됨)'}
            </span>
          </div>

          {/* 내용 or 수정 폼 */}
          {editingId === comment.id ? (
            <div>
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                maxLength={500}
                rows={3}
                className="w-full text-sm rounded-xl p-2.5 resize-none"
                style={{ border: '1.5px solid rgba(196,181,253,0.6)', outline: 'none', color: '#3B0764', background: 'white' }}
              />
              <div className="flex gap-2 mt-2 justify-end">
                <button
                  onClick={() => setEditingId(null)}
                  className="text-xs px-3 py-1.5 rounded-xl font-bold"
                  style={{ background: 'white', color: '#9CA3AF', border: '1.5px solid #E5E7EB' }}
                  disabled={isPending}
                >취소</button>
                <button
                  onClick={handleUpdate}
                  className="text-xs px-3 py-1.5 rounded-xl font-bold"
                  style={{ background: '#7C3AED', color: 'white' }}
                  disabled={isPending || !editContent.trim()}
                >{isPending ? '저장 중...' : '저장'}</button>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed" style={{ color: '#4C1D95' }}>
              {comment.content}
            </p>
          )}

          {/* 액션 버튼 행: 좋아요 + 답글 + 수정/삭제 */}
          {editingId !== comment.id && (
            <div className="flex items-center gap-3 mt-2">
              {/* 좋아요 */}
              <button
                onClick={handleLike}
                disabled={isPending}
                className="flex items-center gap-1 text-xs font-bold transition-all"
                style={{ color: liked ? '#BE185D' : '#A78BFA', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <span>{liked ? '❤️' : '🤍'}</span>
                <span>{likeCount}</span>
              </button>

              {/* 답글 달기 (최상위 댓글에만, 로그인 시) */}
              {!isReply && currentUserId && (
                <button
                  onClick={() => setShowReplyForm(prev => !prev)}
                  className="text-xs font-bold"
                  style={{ color: '#A78BFA', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {showReplyForm ? '취소' : '답글 달기'}
                </button>
              )}

              {/* 수정/삭제 (본인만) */}
              {isOwner && (
                <>
                  <button
                    onClick={() => { setEditingId(comment.id); setEditContent(comment.content) }}
                    className="text-xs px-2 py-0.5 rounded-lg"
                    style={{ color: '#A78BFA', background: 'rgba(196,181,253,0.2)', border: 'none', cursor: 'pointer' }}
                    disabled={isPending}
                  >수정</button>
                  <button
                    onClick={handleDelete}
                    className="text-xs px-2 py-0.5 rounded-lg"
                    style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: 'none', cursor: 'pointer' }}
                    disabled={isPending}
                  >삭제</button>
                </>
              )}
            </div>
          )}

          {/* 답글 작성 폼 */}
          {showReplyForm && (
            <div className="mt-3">
              <textarea
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder="답글을 입력하세요 (최대 500자)"
                maxLength={500}
                rows={2}
                className="w-full text-sm rounded-xl p-2.5 resize-none"
                style={{ border: '1.5px solid rgba(196,181,253,0.6)', outline: 'none', color: '#3B0764', background: 'white' }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleReply() }
                }}
              />
              <div className="flex justify-end mt-1.5">
                <button
                  onClick={handleReply}
                  disabled={isPending || !replyContent.trim()}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl"
                  style={{
                    background: isPending || !replyContent.trim() ? '#E5E7EB' : 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
                    color: isPending || !replyContent.trim() ? '#9CA3AF' : 'white',
                    border: 'none',
                    cursor: isPending || !replyContent.trim() ? 'not-allowed' : 'pointer',
                  }}
                >{isPending ? '등록 중...' : '답글 등록'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CommentSection({
  postId,
  initialComments,
  currentUserId,
}: {
  postId: string
  initialComments: Comment[]
  currentUserId: string | null
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [isOpen, setIsOpen] = useState(true)
  const [newContent, setNewContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function refresh() {
    const res = await fetch(`/api/comments?postId=${postId}`)
    if (res.ok) setComments(await res.json())
  }

  async function handleAdd() {
    if (!newContent.trim()) return
    setError(null)
    startTransition(async () => {
      try {
        await addComment(postId, newContent)
        setNewContent('')
        await refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : '오류가 발생했습니다.')
      }
    })
  }

  // 최상위 댓글 (parent_id 없는 것)
  const topLevel = comments.filter(c => !c.parent_id)
  // 대댓글 (parent_id 있는 것) - parent_id 기준으로 그룹핑
  const repliesMap: Record<string, Comment[]> = {}
  for (const c of comments) {
    if (c.parent_id) {
      if (!repliesMap[c.parent_id]) repliesMap[c.parent_id] = []
      repliesMap[c.parent_id].push(c)
    }
  }

  const totalCount = comments.length

  return (
    <div className="mt-6">
      <div style={{ height: '1px', background: 'rgba(196,181,253,0.25)', marginBottom: '20px' }} />

      {/* 헤더 */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between mb-4"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: '#5B21B6' }}>
          댓글
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#EDE9FE', color: '#6D28D9' }}>
            {totalCount}
          </span>
        </h2>
        <span className="text-xs" style={{ color: '#A78BFA' }}>{isOpen ? '접기 ▲' : '펼치기 ▼'}</span>
      </button>

      {isOpen && (
        <div>
          {/* 댓글 목록 */}
          {topLevel.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: '#C4B5FD' }}>
              아직 댓글이 없어요. 첫 댓글을 남겨보세요!
            </p>
          ) : (
            <ul className="flex flex-col gap-3 mb-4">
              {topLevel.map(comment => (
                <li key={comment.id}>
                  {/* 최상위 댓글 */}
                  <div className="rounded-2xl p-4" style={{ background: '#F5F0FF' }}>
                    <CommentItem
                      comment={comment}
                      currentUserId={currentUserId}
                      postId={postId}
                      isReply={false}
                      onRefresh={refresh}
                    />
                  </div>

                  {/* 대댓글 목록 */}
                  {(repliesMap[comment.id] ?? []).length > 0 && (
                    <ul className="flex flex-col gap-2 mt-2 pl-4">
                      {(repliesMap[comment.id] ?? []).map(reply => (
                        <li
                          key={reply.id}
                          className="rounded-2xl p-3"
                          style={{
                            background: '#EDE9FE',
                            borderLeft: '3px solid #C4B5FD',
                          }}
                        >
                          <CommentItem
                            comment={reply}
                            currentUserId={currentUserId}
                            postId={postId}
                            isReply={true}
                            onRefresh={refresh}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* 댓글 작성 폼 */}
          {currentUserId ? (
            <div className="rounded-2xl p-4" style={{ background: 'white', border: '1.5px solid rgba(196,181,253,0.4)' }}>
              <textarea
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="댓글을 입력하세요 (최대 500자)"
                maxLength={500}
                rows={3}
                className="w-full text-sm rounded-xl p-3 resize-none"
                style={{ border: '1.5px solid rgba(196,181,253,0.4)', outline: 'none', color: '#3B0764', background: '#F5F0FF' }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleAdd() }
                }}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs" style={{ color: '#C4B5FD' }}>{newContent.length}/500 · Ctrl+Enter로 등록</span>
                <button
                  onClick={handleAdd}
                  disabled={isPending || !newContent.trim()}
                  className="text-sm font-bold px-4 py-2 rounded-xl transition-opacity"
                  style={{
                    background: isPending || !newContent.trim() ? '#E5E7EB' : 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
                    color: isPending || !newContent.trim() ? '#9CA3AF' : 'white',
                    cursor: isPending || !newContent.trim() ? 'not-allowed' : 'pointer',
                    boxShadow: isPending || !newContent.trim() ? 'none' : '0 2px 12px rgba(109,40,217,0.25)',
                    border: 'none',
                  }}
                >{isPending ? '등록 중...' : '댓글 등록'}</button>
              </div>
              {error && <p className="text-xs mt-2" style={{ color: '#EF4444' }}>{error}</p>}
            </div>
          ) : (
            <p className="text-sm text-center py-4" style={{ color: '#A78BFA' }}>
              댓글을 작성하려면{' '}
              <a href="/login" style={{ color: '#6D28D9', fontWeight: 700 }}>로그인</a>이 필요해요.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
