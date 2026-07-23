import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Heart, Plus, Sparkles, User } from 'lucide-react'

const tabs = [
  { to: '/timeline', label: '日志', icon: BookOpen, emoji: '📔' },
  { to: '/growth', label: '成长', icon: Sparkles, emoji: '🌱' },
  { to: '/compose', label: '', icon: Plus, center: true },
  { to: '/toys', label: '玩偶', icon: Heart, emoji: '🧸' },
  { to: '/me', label: '我的', icon: User, emoji: '🐹' },
] as const

export function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav
      className="absolute bottom-0 inset-x-0 z-20 bg-paper"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -4px 20px rgb(74 67 60 / 0.06)',
      }}
    >
      {/* Center bubble tab highlight like ref */}
      <div className="relative flex items-end justify-around px-1 h-[4.35rem]">
        {tabs.map((tab) => {
          if ('center' in tab && tab.center) {
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className="-mt-6 flex flex-col items-center"
                aria-label="新增记录"
              >
                <span className="relative flex h-[3.6rem] w-[3.6rem] items-center justify-center rounded-full bg-matcha text-white shadow-[0_6px_16px_rgb(181_160_106_/_0.45)] active:scale-95 transition-transform">
                  <Plus className="h-7 w-7" strokeWidth={2.5} />
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-peach text-[9px]">
                    ✨
                  </span>
                </span>
              </Link>
            )
          }
          const active =
            pathname === tab.to ||
            (tab.to === '/toys' && pathname.startsWith('/toys')) ||
            (tab.to === '/timeline' && pathname.startsWith('/entries'))
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] transition-colors ${
                active ? 'text-matcha-deep font-semibold' : 'text-ink-muted'
              }`}
            >
              {active && (
                <span className="absolute -top-1 left-1/2 h-10 w-10 -translate-x-1/2 rounded-2xl bg-mustard-soft/80" />
              )}
              <span className="relative text-xl leading-none">
                {'emoji' in tab ? tab.emoji : '•'}
              </span>
              <span className="relative">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
