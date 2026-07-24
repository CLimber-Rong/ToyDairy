import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { Toast } from '../components/Toast'
import { useApp } from '../context/AppContext'

export function AppLayout() {
  const { loading } = useApp()
  const { pathname } = useLocation()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="app-shell">
      <div className="app-frame">
        {loading ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-ink-muted">
            <div className="loading-pulse flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-mustard-soft text-4xl shadow-[var(--shadow-warm)]">
              🧸
            </div>
            <div className="text-center">
              <p className="font-display text-base text-ink">Toy Dairy</p>
              <p className="mt-1 text-sm text-ink-muted">正在打开手帐…</p>
            </div>
          </div>
        ) : (
          <>
            <div ref={scrollRef} className="page-scroll">
              <Outlet />
            </div>
            <BottomNav />
            <Toast />
          </>
        )}
      </div>
    </div>
  )
}
