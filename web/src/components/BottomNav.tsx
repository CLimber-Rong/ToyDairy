import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Heart, Plus, Sparkles, User } from 'lucide-react'

const tabs = [
  { to: '/timeline', label: '日志', icon: BookOpen },
  { to: '/growth', label: '成长', icon: Sparkles },
  { to: '/compose', label: '', icon: Plus, center: true },
  { to: '/toys', label: '玩偶', icon: Heart },
  { to: '/me', label: '我的', icon: User },
] as const

export function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav
      className="absolute bottom-0 inset-x-0 z-20 border-t border-line bg-paper"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-end justify-around px-1 h-16">
        {tabs.map((tab) => {
          if ('center' in tab && tab.center) {
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className="-mt-5 flex flex-col items-center"
                aria-label="新增记录"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-terra-deep text-white active:opacity-90">
                  <Plus className="h-7 w-7" strokeWidth={2.5} />
                </span>
              </Link>
            )
          }
          const active =
            pathname === tab.to ||
            (tab.to === '/toys' && pathname.startsWith('/toys')) ||
            (tab.to === '/timeline' && pathname.startsWith('/entries'))
          const Icon = tab.icon
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${
                active ? 'text-terra-deep font-medium' : 'text-ink-muted'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
