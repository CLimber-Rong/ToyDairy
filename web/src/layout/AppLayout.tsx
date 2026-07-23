import { Outlet } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { Toast } from '../components/Toast'
import { useApp } from '../context/AppContext'

export function AppLayout() {
  const { loading } = useApp()

  return (
    <div className="app-shell">
      <div className="app-frame">
        {loading ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-ink-muted">
            <div className="text-4xl animate-pulse">🧸</div>
            <p className="text-sm">加载中…</p>
          </div>
        ) : (
          <>
            <div className="page-scroll">
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
