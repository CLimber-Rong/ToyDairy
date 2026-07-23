import { Link } from 'react-router-dom'
import {
  BookOpen,
  PenLine,
} from 'lucide-react'
import { EntryCard } from '../components/EntryCard'
import { EmptyState } from '../components/EmptyState'
import { useApp } from '../context/AppContext'

const SHORTCUTS = [
  { to: '/compose', label: '写日记', emoji: '✏️', bg: 'bg-[#fff0e8]' },
  { to: '/toys/new', label: '新玩偶', emoji: '🧸', bg: 'bg-[#e8f5ee]' },
  { to: '/growth', label: '成长档', emoji: '🌱', bg: 'bg-[#eef6e4]' },
  { to: '/toys', label: '身份卡', emoji: '🪪', bg: 'bg-[#fff6e0]' },
  { to: '/me', label: '我的', emoji: '🐹', bg: 'bg-[#f0eef8]' },
  { to: '/compose', label: '传照片', emoji: '📷', bg: 'bg-[#e8f0fa]' },
  { to: '/timeline', label: '时间轴', emoji: '🗓️', bg: 'bg-[#fdf0f0]' },
  { to: '/growth', label: '城市', emoji: '🗺️', bg: 'bg-[#e8f8f4]' },
] as const

export function TimelinePage() {
  const { currentToy, entries, toys } = useApp()

  const totalEntries = entries.length
  const withPhoto = entries.filter((e) => e.imageUrl).length
  const progress =
    totalEntries === 0
      ? 12
      : Math.min(100, Math.round((withPhoto / Math.max(totalEntries, 1)) * 100) || 30)

  return (
    <div className="min-h-full">
      <div className="header-band pattern-soft px-4 pb-3 pt-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧸</span>
            <span className="font-display text-xl tracking-wide text-ink">
              Toy Dairy
            </span>
          </div>
          <div className="flex gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-lg shadow-[var(--shadow-warm-sm)]">
              📅
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-lg shadow-[var(--shadow-warm-sm)]">
              🔔
            </span>
          </div>
        </div>

        <div className="mb-2 flex justify-end gap-1 pr-2 text-2xl opacity-90">
          <span>🐹</span>
          <span>🐻</span>
          <span className="text-mustard">✦</span>
        </div>

        <div className="card-paper relative overflow-hidden p-3.5">
          {currentToy ? (
            <div className="flex gap-3">
              <div className="flex h-[4.75rem] w-[3.75rem] shrink-0 flex-col items-center justify-center rounded-xl bg-mint/60 text-2xl">
                🧸
                <span className="mt-1 rounded-full bg-matcha px-1.5 py-0.5 text-[9px] font-medium text-white">
                  当前
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="truncate font-medium text-ink">
                      {currentToy.name}
                    </h2>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {currentToy.role} · {currentToy.birthPlace}
                    </p>
                  </div>
                  <Link to="/toys" className="shrink-0 text-xs text-matcha-deep">
                    切换 ›
                  </Link>
                </div>
                <div className="mt-2.5">
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-ink-muted">
                    <span>
                      {totalEntries} 条记录 · {withPhoto} 张照片
                    </span>
                    <span>{toys.length} 只玩偶</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 py-1">
              <p className="text-sm text-ink-soft">还没有玩偶哦</p>
              <Link to="/toys/new" className="btn-primary px-4 py-2 text-xs">
                去创建
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 px-4 pb-4 pt-1">
        <div className="card-paper px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium text-ink">今日手帐</h3>
            <Link to="/compose" className="text-ink-muted">
              <PenLine className="h-4 w-4" />
            </Link>
          </div>
          <div className="mb-4 flex justify-around text-center">
            <div>
              <p className="font-display text-2xl text-matcha-deep">
                {totalEntries}
                <span className="text-sm text-ink-muted"> 条</span>
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">全部日记</p>
            </div>
            <div className="w-px bg-line" />
            <div>
              <p className="font-display text-2xl text-ink">
                {withPhoto}
                <span className="text-sm text-ink-muted"> 张</span>
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">带图记录</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Link to="/compose" className="btn-primary py-3 text-sm">
              继续记录
            </Link>
            <Link to="/toys" className="btn-secondary py-3 text-sm">
              看身份卡
            </Link>
          </div>
        </div>

        <div className="card-paper px-3 py-4">
          <div className="grid grid-cols-4 gap-y-4">
            {SHORTCUTS.map((s) => (
              <Link
                key={s.label}
                to={s.to}
                className="flex flex-col items-center gap-1.5"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${s.bg}`}
                >
                  {s.emoji}
                </span>
                <span className="text-[11px] text-ink-soft">{s.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[1.25rem] bg-[#ff9e9e] px-4 py-3.5 text-white shadow-[var(--shadow-warm)]">
          <div className="relative z-[1] max-w-[70%]">
            <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px]">
              小贴士
            </span>
            <p className="font-display mt-1.5 text-lg leading-snug">
              给玩偶写一句今日独白吧～
            </p>
          </div>
          <span className="absolute -right-1 bottom-0 text-5xl opacity-90">
            🐹
          </span>
        </div>

        <div>
          <div className="mb-2.5 flex items-center justify-between px-0.5">
            <h3 className="flex items-center gap-1.5 font-medium text-ink">
              <BookOpen className="h-4 w-4 text-matcha-deep" />
              最近记录
            </h3>
            {currentToy && (
              <span className="text-xs text-ink-muted">{currentToy.name}</span>
            )}
          </div>

          {!currentToy ? (
            <EmptyState
              title="还没有玩偶"
              desc="先创建一只玩偶，再开始记录吧。"
              action={
                <Link to="/toys/new" className="btn-primary px-6 py-2.5 text-sm">
                  新建玩偶
                </Link>
              }
            />
          ) : entries.length === 0 ? (
            <EmptyState
              emoji="📔"
              title="还没有记录"
              desc="点中间的 + 写一条旅行或日常日记。"
              action={
                <Link to="/compose" className="btn-primary px-6 py-2.5 text-sm">
                  写一条
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {entries.map((e) => (
                <EntryCard key={e.id} entry={e} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
