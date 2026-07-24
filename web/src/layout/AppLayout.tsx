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
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-ink-muted">
            <div className="h-8 w-8 animate-pulse rounded-full bg-matcha/30" />
            <p className="text-sm">加载中…</p>
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
