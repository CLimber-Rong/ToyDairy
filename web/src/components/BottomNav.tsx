import { useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Camera,
  Image,
  PenLine,
  Plus,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const tabs = [
  { to: '/timeline', label: '日志', icon: BookOpen, emoji: '📔' },
  { to: '/growth', label: '成长', icon: Sparkles, emoji: '🌱' },
  { to: '/compose', label: '', icon: Plus, center: true },
  { to: '/community', label: '社区', icon: UserRound, emoji: '🪐' },
  { to: '/me', label: '我的', icon: UserRound },
] as const

export function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [composerOpen, setComposerOpen] = useState(false)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  function openComposer() {
    setComposerOpen(true)
  }

  function onImageSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('图片请小于 5MB')
      return
    }

    setComposerOpen(false)
    navigate('/compose', {
      state: { mode: 'photo', imageUrl: URL.createObjectURL(file) },
    })
  }

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
          if (!('to' in tab)) {
            return <span key="nav-spacer" className="flex-1" aria-hidden="true" />
          }
          if ('center' in tab && tab.center) {
            return (
              <button
                key={tab.to}
                type="button"
                onClick={openComposer}
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
            (tab.to === '/timeline' && pathname.startsWith('/entries'))
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
              {'emoji' in tab ? (
                <span className="relative text-xl leading-none">{tab.emoji}</span>
              ) : (
                <TabIcon className="relative h-5 w-5" strokeWidth={2} />
              )}
              <span className="relative">{tab.label}</span>
            </Link>
          )
        })}
      </div>

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageSelected}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onImageSelected}
      />

      {composerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/35 backdrop-blur-[2px]"
          role="presentation"
          onClick={() => setComposerOpen(false)}
        >
          <section
            className="composer-sheet w-full max-w-[390px] rounded-t-[1.75rem] bg-white px-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-12px_40px_rgb(74_67_60_/_0.18)]"
            role="dialog"
            aria-modal="true"
            aria-label="选择记录方式"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto h-1 w-10 rounded-full bg-line" />
            <div className="mt-3 flex items-center justify-between px-1">
              <div>
                <h2 className="font-display text-lg text-ink">记录这一刻</h2>
                <p className="mt-0.5 text-xs text-ink-muted">选择一种方式开始</p>
              </div>
              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-cream-dark text-ink-muted"
                aria-label="关闭"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <ComposerChoice
                icon={<Image className="h-6 w-6" />}
                label="从相册选择"
                color="bg-mist-soft text-matcha-deep"
                onClick={() => galleryInputRef.current?.click()}
              />
              <ComposerChoice
                icon={<Camera className="h-6 w-6" />}
                label="拍照记录"
                color="bg-peach-soft text-rose-deep"
                onClick={() => cameraInputRef.current?.click()}
              />
              <ComposerChoice
                icon={<PenLine className="h-6 w-6" />}
                label="纯文字记录"
                color="bg-mustard-soft text-terra-deep"
                onClick={() => {
                  setComposerOpen(false)
                  navigate('/compose', { state: { mode: 'text' } })
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => setComposerOpen(false)}
              className="mt-5 w-full rounded-full bg-cream-dark py-3 text-sm font-medium text-ink-soft active:opacity-80"
            >
              取消
            </button>
          </section>
        </div>
      )}
    </nav>
  )
}

function ComposerChoice({
  icon,
  label,
  color,
  onClick,
}: {
  icon: ReactNode
  label: string
  color: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-2xl py-2 active:scale-95 transition-transform"
    >
      <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
        {icon}
      </span>
      <span className="whitespace-nowrap text-xs text-ink-soft">{label}</span>
    </button>
  )
}
