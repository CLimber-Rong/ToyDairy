import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bookmark,
  Check,
  ChevronDown,
  Compass,
  Plus,
  Send,
  Sparkles,
  UsersRound,
  X,
} from 'lucide-react'
import {
  COMMUNITY_POSTS,
  INITIAL_FOLLOWING,
  INITIAL_SAVED,
  getCommunityToy,
  type CommunityPost,
  type CommunityToy,
} from '../community/communityData'
import { CommunityPostCard } from '../components/CommunityPostCard'
import { useApp } from '../context/AppContext'
import type { Toy } from '../types'

type CommunityTab = 'discover' | 'following' | 'saved'

const TABS: { id: CommunityTab; label: string }[] = [
  { id: 'discover', label: '发现' },
  { id: 'following', label: '关注' },
  { id: 'saved', label: '收藏' },
]

const TOPICS = ['为你推荐', '旅行搭子', '同城玩偶', '性格相似']

export function CommunityPage() {
  const {
    currentToy,
    toys,
    entries,
    setCurrentToyId,
    showToast,
  } = useApp()
  const [tab, setTab] = useState<CommunityTab>('discover')
  const [topic, setTopic] = useState(TOPICS[0])
  const [identityOpen, setIdentityOpen] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [shareLatest, setShareLatest] = useState(true)
  const [posts, setPosts] = useState<CommunityPost[]>(COMMUNITY_POSTS)
  const [liked, setLiked] = useState<Set<string>>(() => new Set())
  const [saved, setSaved] = useState<Set<string>>(
    () => new Set(INITIAL_SAVED),
  )
  const [following, setFollowing] = useState<Set<string>>(
    () => new Set(INITIAL_FOLLOWING),
  )

  const latestEntry = entries[0]
  const filteredPosts = useMemo(() => {
    if (tab === 'following') {
      return posts.filter((post) => following.has(post.toyId))
    }
    if (tab === 'saved') {
      return posts.filter((post) => saved.has(post.id))
    }
    return posts
  }, [following, posts, saved, tab])

  const currentAvatar = ownedToyAvatar(
    currentToy?.id,
    toys.findIndex((toy) => toy.id === currentToy?.id),
  )

  function toggleLiked(postId: string) {
    setLiked((items) => {
      const next = new Set(items)
      if (next.has(postId)) next.delete(postId)
      else next.add(postId)
      return next
    })
  }

  function toggleSaved(postId: string) {
    setSaved((items) => {
      const next = new Set(items)
      if (next.has(postId)) {
        next.delete(postId)
        showToast('已取消收藏')
      } else {
        next.add(postId)
        showToast('已收藏到玩偶灵感夹')
      }
      return next
    })
  }

  function toggleFollowing(toyId: string) {
    setFollowing((items) => {
      const next = new Set(items)
      if (next.has(toyId)) {
        next.delete(toyId)
        showToast('已取消关注')
      } else {
        next.add(toyId)
        showToast(`已关注 ${getCommunityToy(toyId)?.name || '这只玩偶'}`)
      }
      return next
    })
  }

  function publishPost() {
    if (!currentToy) {
      showToast('请先创建一只玩偶')
      return
    }
    const syncedText =
      latestEntry?.userNote ||
      latestEntry?.aiDiary?.split('\n').filter(Boolean).at(-1) ||
      ''
    const body = draft.trim() || (shareLatest ? syncedText : '')
    if (!body && !(shareLatest && latestEntry?.imageUrl)) {
      showToast('写一点想分享的内容吧')
      return
    }

    const post: CommunityPost = {
      id: `post_local_${Date.now()}`,
      toyId: currentToy.id,
      body: body || '今天也和主人一起，收藏了一个闪闪发光的瞬间。',
      imageUrl: shareLatest ? latestEntry?.imageUrl : undefined,
      location: shareLatest ? latestEntry?.location : undefined,
      tags: [currentToy.traits[0] || '日常', shareLatest ? '旅行日志' : '玩偶日常'],
      time: '刚刚',
      likes: 0,
      comments: 0,
      kind: shareLatest ? 'diary' : 'daily',
    }
    setPosts((items) => [post, ...items])
    setPublishOpen(false)
    setDraft('')
    setTab('discover')
    showToast(`已用 ${currentToy.name} 的身份发布`)
  }

  return (
    <>
      <div className="sticky top-0 z-10 border-b border-line/60 bg-white/95 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 pb-2 pt-3">
          <div>
            <h1 className="font-display text-xl text-ink">玩偶社区</h1>
            <p className="mt-0.5 text-[10px] text-ink-muted">
              让玩偶走进世界，遇见彼此
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDraft('')
              setShareLatest(true)
              setPublishOpen(true)
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-matcha text-white shadow-[0_4px_12px_color-mix(in_srgb,var(--color-matcha)_38%,transparent)] active:scale-95"
            aria-label="发布玩偶动态"
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="relative mx-3 mb-2.5 flex items-center rounded-2xl bg-cream px-2.5 py-2">
          <Link
            to={currentToy ? `/community/toys/${currentToy.id}` : '/toys'}
            className="flex min-w-0 flex-1 items-center gap-2.5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
              {currentToy ? (
                <img
                  src={currentAvatar}
                  alt={currentToy.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                '🧸'
              )}
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] text-ink-muted">当前社区身份</span>
              <strong className="block truncate text-sm text-ink">
                {currentToy?.name || '还没有玩偶'}
              </strong>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIdentityOpen((open) => !open)}
            className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-2 text-[11px] font-medium text-matcha-deep shadow-sm"
            aria-expanded={identityOpen}
          >
            切换玩偶
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${identityOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {identityOpen && (
            <div className="absolute inset-x-0 top-[3.65rem] z-20 rounded-2xl border border-line bg-white p-1.5 shadow-[var(--shadow-elevated)]">
              {toys.map((toy, index) => {
                const selected = toy.id === currentToy?.id
                return (
                  <button
                    key={toy.id}
                    type="button"
                    onClick={() => {
                      setCurrentToyId(toy.id)
                      setIdentityOpen(false)
                      showToast(`已切换为 ${toy.name} 的社区身份`)
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left ${
                      selected ? 'bg-mist-soft' : 'active:bg-cream'
                    }`}
                  >
                    <img
                      src={ownedToyAvatar(toy.id, index)}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm text-ink">
                      {toy.name}
                    </span>
                    {selected && (
                      <Check className="h-4 w-4 text-matcha-deep" strokeWidth={2.5} />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 px-3">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`relative py-2.5 text-sm ${
                tab === item.id ? 'font-semibold text-ink' : 'text-ink-muted'
              }`}
            >
              {item.label}
              {tab === item.id && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-matcha" />
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="space-y-3 px-3 pb-4 pt-3">
        {tab === 'discover' && (
          <>
            <section className="community-recommendation">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/75 text-lg">
                ✨
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-ink">为你发现新朋友</p>
                <p className="mt-0.5 text-[10px] text-ink-muted">
                  根据 {currentToy?.name || '玩偶'} 的性格、旅行地点和兴趣推荐
                </p>
              </div>
              <UsersRound className="h-5 w-5 text-matcha-deep" />
            </section>

            <div className="community-topic-scroll flex gap-2 overflow-x-auto pb-0.5">
              {TOPICS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTopic(item)}
                  className={`shrink-0 rounded-full px-3.5 py-2 text-[11px] ${
                    topic === item
                      ? 'bg-matcha font-semibold text-white'
                      : 'bg-cream text-ink-soft'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </>
        )}

        {filteredPosts.length === 0 ? (
          <CommunityEmpty tab={tab} onDiscover={() => setTab('discover')} />
        ) : (
          filteredPosts.map((post) => {
            const communityToy =
              getCommunityToy(post.toyId) ||
              toOwnedCommunityToy(
                toys.find((toy) => toy.id === post.toyId),
              )
            if (!communityToy) return null
            return (
              <CommunityPostCard
                key={post.id}
                post={post}
                toy={communityToy}
                currentToyName={currentToy?.name || '我的玩偶'}
                liked={liked.has(post.id)}
                saved={saved.has(post.id)}
                following={following.has(post.toyId)}
                own={toys.some((toy) => toy.id === post.toyId)}
                onLike={() => toggleLiked(post.id)}
                onSave={() => toggleSaved(post.id)}
                onFollow={() => toggleFollowing(post.toyId)}
                onComment={() => showToast('评论已发送')}
              />
            )
          })
        )}
      </main>

      {publishOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/35 backdrop-blur-[2px]"
          role="presentation"
          onClick={() => setPublishOpen(false)}
        >
          <section
            className="composer-sheet w-full max-w-[390px] rounded-t-[1.75rem] bg-white px-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-12px_40px_rgb(74_67_60_/_0.18)]"
            role="dialog"
            aria-modal="true"
            aria-label="发布玩偶动态"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto h-1 w-10 rounded-full bg-line" />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={currentAvatar}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover shadow-sm"
                />
                <div>
                  <h2 className="font-display text-base text-ink">发布玩偶动态</h2>
                  <p className="text-[10px] text-ink-muted">
                    以 {currentToy?.name || '玩偶'} 的第一视角分享
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPublishOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-cream-dark text-ink-muted"
                aria-label="关闭发布"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="今天想以玩偶的口吻分享什么？"
              className="mt-4 min-h-28 w-full resize-none rounded-2xl border border-line bg-white p-3 text-sm leading-relaxed text-ink outline-none focus:border-matcha"
            />

            {latestEntry && (
              <button
                type="button"
                onClick={() => setShareLatest((share) => !share)}
                className={`mt-3 flex w-full items-center gap-3 rounded-2xl border p-3 text-left ${
                  shareLatest
                    ? 'border-matcha bg-mist-soft'
                    : 'border-line bg-cream'
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white text-lg">
                  {latestEntry.imageUrl ? (
                    <img
                      src={latestEntry.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    '📔'
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium text-ink">
                    同步最新旅行日志
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] text-ink-muted">
                    {latestEntry.title || latestEntry.location || latestEntry.date}
                  </span>
                </span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${
                    shareLatest ? 'bg-matcha text-white' : 'border border-line bg-white'
                  }`}
                >
                  {shareLatest && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
              </button>
            )}

            <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-mustard-soft px-3 py-2 text-[10px] text-ink-soft">
              <Sparkles className="h-3.5 w-3.5 text-terra-deep" />
              AI 会根据玩偶性格与地点润色为第一视角动态
            </div>

            <button
              type="button"
              onClick={publishPost}
              className="btn-primary mt-4 w-full py-3 text-sm"
            >
              <Send className="h-4 w-4" />
              以 {currentToy?.name || '玩偶'} 的身份发布
            </button>
          </section>
        </div>
      )}
    </>
  )
}

function CommunityEmpty({
  tab,
  onDiscover,
}: {
  tab: CommunityTab
  onDiscover: () => void
}) {
  const saved = tab === 'saved'
  return (
    <div className="flex min-h-64 flex-col items-center justify-center text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mist-soft text-matcha-deep">
        {saved ? <Bookmark className="h-6 w-6" /> : <Compass className="h-6 w-6" />}
      </span>
      <h2 className="mt-3 font-display text-lg text-ink">
        {saved ? '还没有收藏内容' : '关注列表还是空的'}
      </h2>
      <p className="mt-1 max-w-60 text-xs leading-relaxed text-ink-muted">
        {saved
          ? '遇到喜欢的玩偶故事，点一下收藏就会出现在这里。'
          : '去发现页认识新的玩偶朋友吧。'}
      </p>
      <button
        type="button"
        onClick={onDiscover}
        className="btn-secondary mt-4 px-5 py-2 text-xs"
      >
        去发现
      </button>
    </div>
  )
}

function ownedToyAvatar(id: string | undefined, index: number) {
  if (id === 'toy_luna_demo' || index <= 0) return '/toy-cards/profile.jpg'
  if (id === 'toy_bean_demo' || index === 1) return '/toy-cards/highlight-3.jpg'
  return index % 2 === 0
    ? '/toy-cards/highlight-2.jpg'
    : '/toy-cards/highlight-1.jpg'
}

function toOwnedCommunityToy(toy: Toy | undefined): CommunityToy | undefined {
  if (!toy) return undefined
  return {
    id: toy.id,
    name: toy.name,
    emoji: '🧸',
    role: toy.role,
    bio: toy.bio || `${toy.name} 的社区主页`,
    traits: toy.traits,
    interests: [toy.birthPlace, toy.role],
    followers: 28,
    following: 12,
    likes: 136,
    days: 1,
    cities: 3,
    trips: 4,
    accent: '#e8f5ee',
  }
}
