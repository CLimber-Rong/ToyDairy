import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Info, Palette, Settings, Shield } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useTheme } from '../theme/ThemeProvider'

const MENU_GRID = [
  { icon: '⭐', label: '我的收藏' },
  { icon: '📋', label: '成长详情' },
  { icon: '🏅', label: '勋章馆' },
  { icon: '🎨', label: '切换配色', to: '/me/settings' },
  { icon: '⚙️', label: '设置', to: '/me/settings' },
  { icon: '🔊', label: '声音设置', to: '/me/settings' },
] as const

export function MePage() {
  const { toys, entries, currentToy, resetDemo, showToast } = useApp()
  const { theme } = useTheme()

  return (
    <div className="min-h-full">
      <div className="header-band pattern-soft px-4 pb-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mustard-soft text-3xl shadow-[var(--shadow-warm-sm)] ring-4 ring-paper/80">
            🐹
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="truncate font-medium text-ink">演示旅人</h2>
              <span className="text-ink-muted">›</span>
            </div>
            <p className="mt-0.5 text-xs text-ink-muted">
              ID: demo@toydairy · {theme.name}
            </p>
          </div>
          <Link
            to="/me/settings"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-paper text-matcha-deep shadow-[var(--shadow-warm-sm)] active:opacity-80"
            aria-label="设置"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-mustard-soft px-3.5 py-3 shadow-[var(--shadow-warm-sm)]">
          <span className="text-3xl">🧀</span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-ink">手帐会员中心</p>
            <p className="text-[11px] text-ink-muted">解锁更多 AI 日记灵感</p>
          </div>
          <span className="shrink-0 rounded-full bg-matcha px-3 py-1.5 text-xs font-semibold text-white">
            了解 ›
          </span>
        </div>
      </div>

      <div className="space-y-3 px-4 pb-4 -mt-1">
        <div className="card-paper px-2 py-4">
          <div className="grid grid-cols-4 text-center">
            <Stat label="玩偶" value={String(toys.length)} />
            <Stat label="日记" value={String(entries.length)} />
            <Stat
              label="照片"
              value={String(entries.filter((e) => e.imageUrl).length)}
            />
            <Stat
              label="当前"
              value={currentToy ? '1' : '0'}
              sub={currentToy?.name}
            />
          </div>
          <button
            type="button"
            className="mt-2 w-full text-center text-xs text-ink-muted"
          >
            前往统计详情 ›
          </button>
        </div>

        <div className="card-paper px-2 py-4">
          <div className="grid grid-cols-4 gap-y-4">
            {MENU_GRID.map((m) => {
              const body = (
                <>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cream text-xl">
                    {m.icon}
                  </span>
                  <span className="text-[11px]">{m.label}</span>
                </>
              )
              if ('to' in m && m.to) {
                return (
                  <Link
                    key={m.label}
                    to={m.to}
                    className="flex flex-col items-center gap-1.5 text-ink-soft active:opacity-80"
                  >
                    {body}
                  </Link>
                )
              }
              return (
                <div
                  key={m.label}
                  className="flex flex-col items-center gap-1.5 text-ink-soft"
                >
                  {body}
                </div>
              )
            })}
          </div>
        </div>

        <div className="card-paper overflow-hidden">
          <LinkRow
            to="/me/settings"
            icon={<Palette className="h-4 w-4" />}
            label="切换配色"
            hint={theme.name}
          />
          <LinkRow
            to="/me/settings"
            icon={<Settings className="h-4 w-4" />}
            label="设置"
          />
          <LinkRow
            to="/me/settings"
            icon={<Shield className="h-4 w-4" />}
            label="隐私设置"
          />
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="text-matcha-deep">
              <Info className="h-4 w-4" />
            </span>
            <span className="flex-1 text-sm text-ink">关于我们</span>
            <span className="text-xs text-ink-muted">Toy Dairy MVP</span>
          </div>
        </div>

        <div className="card-paper p-4 text-sm text-ink-soft">
          <p className="font-medium text-ink">前端 Mock 说明</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-ink-muted">
            <li>数据存在浏览器 localStorage</li>
            <li>接口对齐 plan.md</li>
            <li>图片仅本地预览，未接 R2</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={async () => {
            await resetDemo()
            showToast('演示数据已重置')
          }}
          className="btn-secondary w-full py-3 text-sm"
        >
          重置演示数据
        </button>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div>
      <div className="font-display truncate px-1 text-xl text-matcha-deep">
        {sub ? (
          <span className="text-sm leading-7 text-ink">{sub}</span>
        ) : (
          value
        )}
      </div>
      <div className="mt-0.5 text-[11px] text-ink-muted">{label}</div>
    </div>
  )
}

function LinkRow({
  to,
  icon,
  label,
  hint,
}: {
  to: string
  icon: ReactNode
  label: string
  hint?: string
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 border-b border-line/70 px-4 py-3.5 active:bg-cream"
    >
      <span className="text-matcha-deep">{icon}</span>
      <span className="flex-1 text-sm text-ink">{label}</span>
      {hint && <span className="text-xs text-ink-muted">{hint}</span>}
      <ChevronRight className="h-4 w-4 text-ink-muted" />
    </Link>
  )
}
