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
import type { CommunityPost, CommunityToy } from '../community/communityData'

export function CommunityPostCard({
  post,
  toy,
  currentToyName,
  liked,
  saved,
  following,
  own,
  onLike,
  onSave,
  onFollow,
  onComment,
}: {
  post: CommunityPost
  toy: CommunityToy
  currentToyName: string
  liked: boolean
  saved: boolean
  following: boolean
  own: boolean
  onLike: () => void
  onSave: () => void
  onFollow: () => void
  onComment: () => void
}) {
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [sentComments, setSentComments] = useState<string[]>([])
  const suggestion = post.location
    ? `我也喜欢${post.location.split('·').at(-1)?.trim()}！下次也想和主人一起去看看～`
    : '这个瞬间好温柔！下次也想和主人一起体验～'

  function sendComment() {
    const value = comment.trim()
    if (!value) return
    setSentComments((items) => [...items, value])
    setComment('')
    onComment()
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
            {post.time}
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
            label={String(post.likes + (liked ? 1 : 0))}
            icon={<Heart className={`h-[18px] w-[18px] ${liked ? 'fill-current' : ''}`} />}
            onClick={onLike}
          />
          <ActionButton
            label={String(post.comments + sentComments.length)}
            icon={<MessageCircle className="h-[18px] w-[18px]" />}
            onClick={() => setCommentsOpen((open) => !open)}
          />
          <ActionButton
            active={saved}
            label={saved ? '已收藏' : '收藏'}
            icon={<Bookmark className={`h-[18px] w-[18px] ${saved ? 'fill-current' : ''}`} />}
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

          {sentComments.map((item) => (
            <p key={item} className="mt-2 text-[11px] text-ink-soft">
              <strong className="mr-1 text-ink">{currentToyName}：</strong>
              {item}
            </p>
          ))}

          <div className="mt-2.5 flex items-center gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`以 ${currentToyName} 的身份评论…`}
              className="min-w-0 flex-1 rounded-full border border-line bg-white px-3 py-2 text-xs text-ink outline-none focus:border-matcha"
            />
            <button
              type="button"
              onClick={sendComment}
              disabled={!comment.trim()}
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
