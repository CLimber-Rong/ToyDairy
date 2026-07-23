import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Plus } from 'lucide-react'
import {
  CommunityNavIcon,
  DiaryNavIcon,
  GrowthNavIcon,
  MeNavIcon,
} from './NavIcons'
import { RecordMethodSheet } from './RecordMethodSheet'

const tabs = [
  { to: '/archive', label: '档案', icon: DiaryNavIcon },
  { to: '/growth', label: '成长', icon: GrowthNavIcon },
  { to: '/compose', label: '', icon: Plus, center: true },
  { to: '/community', label: '社区', icon: CommunityNavIcon },
  { to: '/me', label: '我的', icon: MeNavIcon },
] as const

export function BottomNav() {
  const { pathname } = useLocation()
  const [composerOpen, setComposerOpen] = useState(false)

  return (
    <nav
      className="bottom-nav z-20 bg-paper"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -4px 20px rgb(74 67 60 / 0.06)',
      }}
    >
      {/* Center bubble tab highlight like ref */}
      <div className="relative flex items-end justify-around px-1 h-[4.35rem]">
        {tabs.map((tab) => {
          if (!('to' in tab)) {
            return <span key="nav-spacer" className="flex-1" aria-hidden="true" />
          }
          if ('center' in tab && tab.center) {
            return (
              <button
                key={tab.to}
                type="button"
                onClick={() => setComposerOpen(true)}
                className="-mt-6 flex flex-col items-center"
                aria-label="新增记录"
              >
                <span className="relative flex h-[3.6rem] w-[3.6rem] items-center justify-center rounded-full bg-matcha text-white shadow-[0_6px_16px_rgb(181_160_106_/_0.45)] active:scale-95 transition-transform">
                  <Plus className="h-7 w-7" strokeWidth={2.5} />
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-peach text-[9px]">
                    ✨
                  </span>
                </span>
              </button>
            )
          }
          const active =
            pathname === tab.to ||
            (tab.to === '/me' &&
              (pathname.startsWith('/me') || pathname.startsWith('/toys'))) ||
            (tab.to === '/community' && pathname.startsWith('/community')) ||
            (tab.to === '/archive' &&
              (pathname.startsWith('/archive') ||
                pathname.startsWith('/entries') ||
                pathname.startsWith('/memories')))
          const TabIcon = tab.icon
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
              <TabIcon className="relative h-7 w-7" />
              <span className="relative">{tab.label}</span>
            </Link>
          )
        })}
      </div>

      <RecordMethodSheet
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
      />
    </nav>
  )
}
