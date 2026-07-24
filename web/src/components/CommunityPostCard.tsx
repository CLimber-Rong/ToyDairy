import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Bookmark,
  Heart,
  MapPin,
  MessageCircle,
  Send,
  Sparkles,
} from 'lucide-react'
import {
  commentSuggestion,
  formatRelativeTime,
  type CommunityComment,
  type CommunityPost,
  type CommunityToy,
} from '../community/communityData'
import { resolveCommunityToy } from '../community/communityData'
import type { Toy } from '../types'

export function CommunityPostCard({
  post,
  toy,
  currentToyName,
  currentToyId,
  ownedToys,
  comments,
  liked,
  saved,
  following,
  own,
  likeCount,
  onLike,
  onSave,
  onFollow,
  onComment,
}: {
  post: CommunityPost
  toy: CommunityToy
  currentToyName: string
  currentToyId: string | null
  ownedToys: Toy[]
  comments: CommunityComment[]
  liked: boolean
  saved: boolean
  following: boolean
  own: boolean
  likeCount: number
  onLike: () => void
  onSave: () => void
  onFollow: () => void
  onComment: (body: string) => Promise<void> | void
}) {
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [sending, setSending] = useState(false)
  const suggestion = commentSuggestion(post.location, currentToyName)
  const postComments = comments.filter((c) => c.postId === post.id)

  async function sendComment() {
    const value = comment.trim()
    if (!value || sending) return
    setSending(true)
    try {
      await onComment(value)
      setComment('')
    } finally {
      setSending(false)
    }
  }

  return (
    <article className="overflow-hidden rounded-[1.35rem] border border-line/70 bg-white shadow-[var(--shadow-warm)]">
      <div className="flex items-center gap-2.5 px-3.5 py-3">
        <Link
          to={`/community/toys/${toy.id}`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl shadow-sm"
          style={{ background: toy.accent }}
          aria-label={`查看 ${toy.name} 的主页`}
        >
          {toy.emoji}
        </Link>
        <Link to={`/community/toys/${toy.id}`} className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="truncate text-sm font-semibold text-ink">{toy.name}</h2>
            <span className="rounded-full bg-mist-soft px-1.5 py-0.5 text-[9px] text-matcha-deep">
              {toy.role}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[10px] text-ink-muted">
            {formatRelativeTime(post.createdAt)}
            {post.location ? ` · ${post.location}` : ''}
          </p>
        </Link>
        {!own && (
          <button
            type="button"
            onClick={onFollow}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
              following
                ? 'bg-cream-dark text-ink-muted'
                : 'bg-matcha text-white shadow-sm'
            }`}
          >
            {following ? '已关注' : '+ 关注'}
          </button>
        )}
      </div>

      {post.imageUrl && (
        <Link to={`/community/toys/${toy.id}`} className="community-post-image block">
          <img src={post.imageUrl} alt={`${toy.name} 的动态照片`} />
        </Link>
      )}

      <div className="px-3.5 pb-3 pt-3">
        <p className="text-[13px] leading-6 text-ink-soft">
          <strong className="mr-1.5 text-ink">{toy.name}</strong>
          {post.body}
        </p>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {post.location && (
            <span className="inline-flex items-center gap-1 rounded-full bg-mist-soft px-2.5 py-1 text-[10px] text-matcha-deep">
              <MapPin className="h-3 w-3" />
              {post.location}
            </span>
          )}
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-mustard-soft px-2.5 py-1 text-[10px] text-ink-soft"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center border-t border-line/60 pt-2.5">
          <ActionButton
            active={liked}
            label={String(likeCount)}
            icon={
              <Heart
                className={`h-[18px] w-[18px] ${liked ? 'fill-current' : ''}`}
              />
            }
            onClick={onLike}
          />
          <ActionButton
            label={String(postComments.length)}
            icon={<MessageCircle className="h-[18px] w-[18px]" />}
            onClick={() => setCommentsOpen((open) => !open)}
          />
          <ActionButton
            active={saved}
            label={saved ? '已收藏' : '收藏'}
            icon={
              <Bookmark
                className={`h-[18px] w-[18px] ${saved ? 'fill-current' : ''}`}
              />
            }
            onClick={onSave}
          />
        </div>
      </div>

      {commentsOpen && (
        <div className="border-t border-line/60 bg-cream/55 px-3.5 py-3">
          <p className="flex items-center gap-1 text-[10px] font-medium text-matcha-deep">
            <Sparkles className="h-3 w-3" />
            根据 {currentToyName} 的人设生成
          </p>
          <button
            type="button"
            onClick={() => setComment(suggestion)}
            className="mt-2 w-full rounded-xl bg-white px-3 py-2.5 text-left text-[11px] leading-relaxed text-ink-soft shadow-sm active:scale-[0.99]"
          >
            “{suggestion}”
            <span className="ml-1 text-matcha-deep">点击使用</span>
          </button>

          <div className="mt-2.5 max-h-48 space-y-2 overflow-y-auto">
            {postComments.length === 0 ? (
              <p className="text-[11px] text-ink-muted">还没有评论，来打个招呼吧</p>
            ) : (
              postComments.map((item) => {
                const author =
                  resolveCommunityToy(item.fromToyId, ownedToys) ||
                  ({
                    id: item.fromToyId,
                    name: '玩偶',
                    emoji: '🧸',
                    accent: '#e8f5ee',
                  } as CommunityToy)
                const isMe = item.fromToyId === currentToyId
                return (
                  <div key={item.id} className="flex gap-2 text-[11px]">
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm"
                      style={{ background: author.accent }}
                    >
                      {author.emoji}
                    </span>
                    <p className="min-w-0 flex-1 leading-relaxed text-ink-soft">
                      <strong className="mr-1 text-ink">
                        {isMe ? currentToyName : author.name}
                      </strong>
                      {item.body}
                      <span className="ml-1.5 text-[10px] text-ink-muted">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </p>
                  </div>
                )
              })
            )}
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void sendComment()
              }}
              placeholder={`以 ${currentToyName} 的身份评论…`}
              className="min-w-0 flex-1 rounded-full border border-line bg-white px-3 py-2 text-xs text-ink outline-none focus:border-matcha"
            />
            <button
              type="button"
              onClick={() => void sendComment()}
              disabled={!comment.trim() || sending}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-matcha text-white disabled:opacity-40"
              aria-label="发送评论"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

function ActionButton({
  active,
  label,
  icon,
  onClick,
}: {
  active?: boolean
  label: string
  icon: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 py-1 text-[11px] ${
        active ? 'font-medium text-rose-deep' : 'text-ink-muted'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
