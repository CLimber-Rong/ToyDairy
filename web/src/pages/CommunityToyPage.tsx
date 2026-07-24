import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Check,
  Heart,
  MapPin,
  MessageCircle,
  Send,
  Sparkles,
  UserPlus,
} from 'lucide-react'
import {
  formatRelativeTime,
  getCommunityToy,
  greetingLine,
  ownedToyAvatar,
  resolveCommunityToy,
  toOwnedCommunityToy,
  type CommunityPost,
  type CommunityToy,
} from '../community/communityData'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import type { Toy } from '../types'

type ProfileTab = 'posts' | 'trips' | 'chat' | 'saved'

export function CommunityToyPage() {
  const { id = '' } = useParams<{ id: string }>()
  const {
    toys,
    currentToy,
    communityPosts,
    communityFollows,
    postCommentCount,
    isFollowingToy,
    toggleFollow,
    sendGreeting,
    listThread,
  } = useApp()

  const [tab, setTab] = useState<ProfileTab>('posts')
  const [chatOpen, setChatOpen] = useState(false)
  const [chatDraft, setChatDraft] = useState('')
  const [sending, setSending] = useState(false)

  const ownedToy = toys.find((toy) => toy.id === id)
  const isOwn = Boolean(ownedToy)
  const toy: CommunityToy | undefined =
    getCommunityToy(id) || (ownedToy ? toOwnedCommunityToy(ownedToy) : undefined)

  const posts = useMemo(
    () => communityPosts.filter((post) => post.toyId === id),
    [communityPosts, id],
  )

  const following = isFollowingToy(id)
  const followerDelta = communityFollows.filter(
    (f) => f.followeeToyId === id,
  ).length
  const thread = listThread(id)

  if (!toy) {
    return (
      <>
        <PageHeader title="玩偶主页" back="/community" soft />
        <div className="py-16 text-center text-sm text-ink-muted">
          这只玩偶暂时藏起来了
        </div>
      </>
    )
  }

  const avatar = isOwn
    ? ownedToyAvatar(toy.id, toys.findIndex((t) => t.id === toy.id))
    : null

  async function onGreeting() {
    if (!currentToy) return
    const body = greetingLine(currentToy.name, toy!.name, toy!.traits)
    setChatDraft(body)
    setChatOpen(true)
    setTab('chat')
  }

  async function sendChat() {
    const body = chatDraft.trim()
    if (!body || !currentToy || sending) return
    setSending(true)
    try {
      await sendGreeting(id, body)
      setChatDraft('')
    } finally {
      setSending(false)
    }
  }

  const displayFollowers = (toy.followers || 0) + Math.max(0, followerDelta)

  return (
    <>
      <PageHeader
        title={isOwn ? '我的社区主页' : '玩偶主页'}
        back="/community"
        soft
        right={
          isOwn ? (
            <span className="rounded-full bg-mist-soft px-3 py-1.5 text-[10px] font-medium text-matcha-deep">
              当前身份
            </span>
          ) : (
            <button
              type="button"
              onClick={() => void toggleFollow(id)}
              className={`flex items-center gap-1 rounded-full px-3 py-2 text-[11px] font-semibold ${
                following
                  ? 'bg-cream-dark text-ink-muted'
                  : 'bg-matcha text-white'
              }`}
            >
              {following ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <UserPlus className="h-3.5 w-3.5" />
              )}
              {following ? '已关注' : '关注'}
            </button>
          )
        }
      />

      <div className="px-3 pb-5 pt-3">
        <section className="community-profile-hero">
          <div
            className="absolute inset-x-0 top-0 h-24 opacity-80"
            style={{
              background: `linear-gradient(135deg, ${toy.accent}, color-mix(in srgb, var(--color-mustard-soft) 72%, white))`,
            }}
          />
          <div className="relative pt-8 text-center">
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white text-4xl shadow-[var(--shadow-elevated)]"
              style={{ background: toy.accent }}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt={toy.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                toy.emoji
              )}
            </div>
            <div className="mt-2 flex items-center justify-center gap-1.5">
              <h1 className="font-display text-xl text-ink">{toy.name}</h1>
              <span className="rounded-full bg-mist-soft px-2 py-1 text-[9px] text-matcha-deep">
                {toy.role}
              </span>
            </div>
            <p className="mx-auto mt-1.5 max-w-72 text-xs leading-relaxed text-ink-soft">
              {toy.bio}
            </p>

            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {toy.traits.map((trait) => (
                <span
                  key={trait}
                  className="rounded-full bg-mustard-soft px-2.5 py-1 text-[10px] text-ink-soft"
                >
                  #{trait}
                </span>
              ))}
              {toy.interests.slice(0, 2).map((interest) => (
                <span
                  key={interest}
                  className="rounded-full bg-mist-soft px-2.5 py-1 text-[10px] text-matcha-deep"
                >
                  {interest}
                </span>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-4 border-t border-line/60 pt-3">
              <ProfileStat value={formatCount(displayFollowers)} label="粉丝" />
              <ProfileStat value={String(toy.following)} label="关注" />
              <ProfileStat value={String(posts.length)} label="动态" />
              <ProfileStat value={formatCount(toy.likes)} label="获赞" />
            </div>
          </div>
        </section>

        <section className="mt-3 grid grid-cols-3 gap-2">
          <GrowthStat value={`${toy.days}天`} label="陪伴时间" emoji="🗓️" />
          <GrowthStat value={String(toy.cities)} label="到访城市" emoji="📍" />
          <GrowthStat value={String(toy.trips)} label="旅行次数" emoji="🧳" />
        </section>

        {!isOwn && (
          <button
            type="button"
            onClick={() => void onGreeting()}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-mustard-soft py-3 text-xs font-semibold text-matcha-deep active:scale-[0.99]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            用 {currentToy?.name || '我的玩偶'} 的口吻打招呼
          </button>
        )}

        <div className="mt-4 grid grid-cols-4 border-b border-line/60">
          {(
            [
              ['posts', isOwn ? '动态' : '动态'],
              ['trips', '旅行'],
              ['chat', isOwn ? '来信' : '对话'],
              ['saved', isOwn ? '收藏' : '灵感'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setTab(value)
                if (value === 'chat' && !isOwn) setChatOpen(true)
              }}
              className={`relative py-3 text-xs ${
                tab === value ? 'font-semibold text-ink' : 'text-ink-muted'
              }`}
            >
              {label}
              {value === 'chat' && thread.length > 0 && (
                <span className="ml-0.5 text-[9px] text-matcha-deep">
                  {thread.length}
                </span>
              )}
              {tab === value && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-matcha" />
              )}
            </button>
          ))}
        </div>

        {tab === 'posts' && (
          <PostGrid
            posts={posts}
            fallback={[]}
            commentCount={postCommentCount}
          />
        )}
        {tab === 'trips' && <TripStories />}
        {tab === 'saved' && (
          <SavedPanel toy={toy} isOwn={isOwn} />
        )}
        {tab === 'chat' && (
          <ChatPanel
            toy={toy}
            isOwn={isOwn}
            thread={thread}
            currentToy={currentToy}
            ownedToys={toys}
            draft={chatDraft}
            setDraft={setChatDraft}
            sending={sending}
            onSend={() => void sendChat()}
            openComposer={!isOwn || chatOpen}
          />
        )}
      </div>
    </>
  )
}

function PostGrid({
  posts,
  fallback,
  commentCount,
}: {
  posts: CommunityPost[]
  fallback: CommunityPost[]
  commentCount: (id: string) => number
}) {
  const visible = posts.length > 0 ? posts : fallback
  if (visible.length === 0) {
    return (
      <p className="mt-6 text-center text-xs text-ink-muted">还没有动态</p>
    )
  }
  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {visible.map((post) => (
        <article
          key={post.id}
          className="overflow-hidden rounded-2xl border border-line/60 bg-white shadow-[var(--shadow-warm-sm)]"
        >
          {post.imageUrl ? (
            <div className="aspect-square overflow-hidden bg-cream">
              <img
                src={post.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center bg-mist-soft p-4 text-center text-xs leading-relaxed text-ink-soft">
              {post.body}
            </div>
          )}
          <div className="p-2.5">
            <p className="line-clamp-2 text-[10px] leading-relaxed text-ink-soft">
              {post.body}
            </p>
            <p className="mt-1 flex items-center gap-1 text-[9px] text-ink-muted">
              <MessageCircle className="h-3 w-3" />
              {commentCount(post.id)}
              <span className="ml-auto">
                {formatRelativeTime(post.createdAt)}
              </span>
            </p>
          </div>
        </article>
      ))}
    </div>
  )
}

function TripStories() {
  return (
    <div className="mt-3 space-y-2">
      {['第一次远行', '最喜欢的城市', '下一站愿望'].map((title, index) => (
        <div
          key={title}
          className="flex items-center gap-3 rounded-2xl border border-line/60 bg-white p-3 shadow-[var(--shadow-warm-sm)]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mist-soft text-lg">
            {['🚂', '🌸', '🗺️'][index]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-ink">{title}</p>
            <p className="mt-0.5 truncate text-[10px] text-ink-muted">
              {
                [
                  '和主人一起坐上开往远方的火车',
                  '每次想起都会开心的地方',
                  '想和新朋友一起抵达',
                ][index]
              }
            </p>
          </div>
          <MapPin className="h-4 w-4 text-matcha-deep" />
        </div>
      ))}
    </div>
  )
}

function SavedPanel({
  toy,
  isOwn,
}: {
  toy: CommunityToy
  isOwn: boolean
}) {
  return (
    <div className="mt-3 rounded-2xl bg-cream p-4 text-center">
      <Heart className="mx-auto h-6 w-6 text-matcha-deep" />
      <p className="mt-2 text-sm font-medium text-ink">
        {isOwn ? '收藏的灵感与故事' : `${toy.name} 公开的旅行灵感`}
      </p>
      <p className="mt-1 text-[11px] text-ink-muted">
        京都樱花、海边日落、冬日列车
      </p>
    </div>
  )
}

function ChatPanel({
  toy,
  isOwn,
  thread,
  currentToy,
  ownedToys,
  draft,
  setDraft,
  sending,
  onSend,
  openComposer,
}: {
  toy: CommunityToy
  isOwn: boolean
  thread: {
    id: string
    fromToyId: string
    toToyId: string
    body: string
    createdAt: string
  }[]
  currentToy: Toy | null
  ownedToys: Toy[]
  draft: string
  setDraft: (v: string) => void
  sending: boolean
  onSend: () => void
  openComposer: boolean
}) {
  if (isOwn) {
    const inbound = thread
    return (
      <div className="mt-3 space-y-2">
        {inbound.length === 0 ? (
          <p className="py-8 text-center text-xs text-ink-muted">
            还没有其他玩偶来信。去发现页认识新朋友吧。
          </p>
        ) : (
          inbound.map((msg) => {
            const from = resolveCommunityToy(msg.fromToyId, ownedToys)
            return (
              <div
                key={msg.id}
                className="rounded-2xl border border-line/60 bg-white p-3 shadow-[var(--shadow-warm-sm)]"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-base"
                    style={{ background: from?.accent || '#eee' }}
                  >
                    {from?.emoji || '🧸'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-ink">
                      {from?.name || '玩偶'}
                    </p>
                    <p className="text-[10px] text-ink-muted">
                      {formatRelativeTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-ink-soft">
                  {msg.body}
                </p>
              </div>
            )
          })
        )}
      </div>
    )
  }

  return (
    <div className="mt-3">
      <div className="max-h-72 space-y-2 overflow-y-auto rounded-2xl bg-cream/70 p-3">
        {thread.length === 0 ? (
          <p className="py-6 text-center text-[11px] text-ink-muted">
            还没有对话。打个招呼认识一下吧。
          </p>
        ) : (
          thread.map((msg) => {
            const mine = msg.fromToyId === currentToy?.id
            const author = resolveCommunityToy(msg.fromToyId, ownedToys)
            return (
              <div
                key={msg.id}
                className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-[12px] leading-relaxed ${
                    mine
                      ? 'bg-matcha text-white'
                      : 'bg-white text-ink-soft shadow-sm'
                  }`}
                >
                  {!mine && (
                    <p className="mb-0.5 text-[10px] font-medium opacity-80">
                      {author?.name || toy.name}
                    </p>
                  )}
                  {msg.body}
                  <p
                    className={`mt-1 text-[9px] ${
                      mine ? 'text-white/70' : 'text-ink-muted'
                    }`}
                  >
                    {formatRelativeTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {openComposer && (
        <div className="mt-2 flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSend()
            }}
            placeholder={`以 ${currentToy?.name || '玩偶'} 的口吻说…`}
            className="min-w-0 flex-1 rounded-full border border-line bg-white px-3 py-2.5 text-xs outline-none focus:border-matcha"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!draft.trim() || sending}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-matcha text-white disabled:opacity-40"
            aria-label="发送"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

function ProfileStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <strong className="block font-display text-base text-ink">{value}</strong>
      <span className="mt-0.5 block text-[9px] text-ink-muted">{label}</span>
    </div>
  )
}

function GrowthStat({
  value,
  label,
  emoji,
}: {
  value: string
  label: string
  emoji: string
}) {
  return (
    <div className="rounded-2xl bg-cream px-2 py-3 text-center">
      <span className="text-base">{emoji}</span>
      <strong className="mt-1 block font-display text-base text-matcha-deep">
        {value}
      </strong>
      <span className="block text-[9px] text-ink-muted">{label}</span>
    </div>
  )
}

function formatCount(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value)
}
