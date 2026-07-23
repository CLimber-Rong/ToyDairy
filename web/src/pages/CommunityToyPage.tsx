import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Check,
  Heart,
  MapPin,
  MessageCircle,
  Sparkles,
  UserPlus,
} from 'lucide-react'
import {
  COMMUNITY_POSTS,
  getCommunityToy,
  type CommunityToy,
} from '../community/communityData'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import type { Toy } from '../types'

type ProfileTab = 'posts' | 'trips' | 'saved'

export function CommunityToyPage() {
  const { id } = useParams<{ id: string }>()
  const { toys, currentToy, showToast } = useApp()
  const [following, setFollowing] = useState(false)
  const [tab, setTab] = useState<ProfileTab>('posts')
  const ownedToy = toys.find((toy) => toy.id === id)
  const isOwn = Boolean(ownedToy)
  const toy = getCommunityToy(id || '') || toProfileToy(ownedToy)

  const posts = useMemo(
    () => COMMUNITY_POSTS.filter((post) => post.toyId === id),
    [id],
  )

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

  const avatar = isOwn ? ownedToyAvatar(toy.id, toys.indexOf(ownedToy!)) : null

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
              onClick={() => {
                setFollowing((value) => !value)
                showToast(following ? '已取消关注' : `已关注 ${toy.name}`)
              }}
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
              <ProfileStat value={formatCount(toy.followers)} label="粉丝" />
              <ProfileStat value={String(toy.following)} label="关注" />
              <ProfileStat
                value={String(isOwn ? Math.max(posts.length, 4) : toy.trips)}
                label="动态"
              />
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
            onClick={() =>
              showToast(
                `${currentToy?.name || '你的玩偶'}：你好呀！我们好像有很多共同兴趣～`,
              )
            }
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-mustard-soft py-3 text-xs font-semibold text-matcha-deep active:scale-[0.99]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            用 {currentToy?.name || '我的玩偶'} 的口吻打招呼
          </button>
        )}

        <div className="mt-4 grid grid-cols-3 border-b border-line/60">
          {([
            ['posts', isOwn ? '我的动态' : 'TA的动态'],
            ['trips', '旅行故事'],
            ['saved', isOwn ? '我的收藏' : '公开收藏'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`relative py-3 text-xs ${
                tab === value ? 'font-semibold text-ink' : 'text-ink-muted'
              }`}
            >
              {label}
              {tab === value && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-matcha" />
              )}
            </button>
          ))}
        </div>

        <ProfileContent tab={tab} toy={toy} posts={posts} isOwn={isOwn} />
      </div>
    </>
  )
}

function ProfileContent({
  tab,
  toy,
  posts,
  isOwn,
}: {
  tab: ProfileTab
  toy: CommunityToy
  posts: typeof COMMUNITY_POSTS
  isOwn: boolean
}) {
  if (tab === 'saved') {
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

  if (tab === 'trips') {
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
                {['和主人一起坐上开往远方的火车', '每次想起都会开心的地方', '想和新朋友一起抵达'][index]}
              </p>
            </div>
            <MapPin className="h-4 w-4 text-matcha-deep" />
          </div>
        ))}
      </div>
    )
  }

  const visiblePosts =
    posts.length > 0
      ? posts
      : COMMUNITY_POSTS.filter((post) => post.imageUrl).slice(0, 3)

  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {visiblePosts.map((post) => (
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
              {post.comments}
            </p>
          </div>
        </article>
      ))}
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

function toProfileToy(toy: Toy | undefined): CommunityToy | undefined {
  if (!toy) return undefined
  return {
    id: toy.id,
    name: toy.name,
    emoji: '🧸',
    role: toy.role,
    bio: toy.bio || `${toy.name} 正在社区里认识新的玩偶朋友。`,
    traits: toy.traits,
    interests: [toy.birthPlace, '旅行手账'],
    followers: 28,
    following: 12,
    likes: 136,
    days: 365,
    cities: 3,
    trips: 4,
    accent: '#e8f5ee',
  }
}

function ownedToyAvatar(id: string, index: number) {
  if (id === 'toy_luna_demo' || index <= 0) return '/toy-cards/profile.jpg'
  if (id === 'toy_bean_demo' || index === 1) return '/toy-cards/highlight-3.jpg'
  return index % 2 === 0
    ? '/toy-cards/highlight-2.jpg'
    : '/toy-cards/highlight-1.jpg'
}
