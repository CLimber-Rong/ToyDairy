import {
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import {
  Camera,
  Check,
  ChevronRight,
  Info,
  Palette,
  Pencil,
  Settings,
  Shield,
  X,
} from 'lucide-react'
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

const PROFILE_NAME_KEY = 'toydairy.profile.name'
const PROFILE_AVATAR_KEY = 'toydairy.profile.avatar'
const DEFAULT_NAME = '今天不睡觉'
const DEFAULT_AVATAR = '/profile/default-avatar.jpg'

function loadProfileValue(key: string, fallback: string) {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

export function MePage() {
  const { toys, entries, currentToy, resetDemo, showToast } = useApp()
  const { theme } = useTheme()
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [profileName, setProfileName] = useState(() =>
    loadProfileValue(PROFILE_NAME_KEY, DEFAULT_NAME),
  )
  const [draftName, setDraftName] = useState(profileName)
  const [editingName, setEditingName] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(() =>
    loadProfileValue(PROFILE_AVATAR_KEY, DEFAULT_AVATAR),
  )

  function saveName() {
    const nextName = draftName.trim()
    if (!nextName) {
      showToast('昵称不能为空')
      return
    }
    setProfileName(nextName)
    setDraftName(nextName)
    setEditingName(false)
    try {
      localStorage.setItem(PROFILE_NAME_KEY, nextName)
    } catch {
      /* localStorage may be unavailable */
    }
    showToast('昵称已更新')
  }

  function onNameKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') saveName()
    if (e.key === 'Escape') {
      setDraftName(profileName)
      setEditingName(false)
    }
  }

  function onAvatarSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件')
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      showToast('头像图片请小于 3MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return
      setAvatarUrl(reader.result)
      try {
        localStorage.setItem(PROFILE_AVATAR_KEY, reader.result)
      } catch {
        showToast('图片较大，头像可能无法长期保存')
        return
      }
      showToast('头像已更新')
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-full">
      <div className="header-band pattern-soft px-4 pb-4 pt-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            className="group relative h-16 w-16 shrink-0 rounded-full bg-mustard-soft shadow-[var(--shadow-warm-sm)] ring-4 ring-paper/80 active:scale-95 transition-transform"
            aria-label="修改头像"
          >
            <img
              src={avatarUrl}
              alt={`${profileName}的头像`}
              className="h-full w-full rounded-full object-cover"
              onError={() => setAvatarUrl(DEFAULT_AVATAR)}
            />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-matcha text-white shadow-sm">
              <Camera className="h-3 w-3" />
            </span>
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatarSelected}
          />
          <div className="min-w-0 flex-1">
            {editingName ? (
              <div className="flex items-center gap-1.5">
                <input
                  autoFocus
                  value={draftName}
                  maxLength={16}
                  onChange={(e) => setDraftName(e.target.value)}
                  onKeyDown={onNameKeyDown}
                  className="min-w-0 flex-1 rounded-xl border border-matcha bg-white px-2.5 py-1.5 text-sm text-ink outline-none"
                  aria-label="新昵称"
                />
                <button
                  type="button"
                  onClick={saveName}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-matcha text-white"
                  aria-label="保存昵称"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraftName(profileName)
                    setEditingName(false)
                  }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-dark text-ink-muted"
                  aria-label="取消修改昵称"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditingName(true)}
                className="flex max-w-full items-center gap-1.5 text-left"
                aria-label="修改昵称"
              >
                <h2 className="truncate font-medium text-ink">{profileName}</h2>
                <Pencil className="h-3.5 w-3.5 shrink-0 text-matcha-deep" />
              </button>
            )}
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

      </div>

      <div className="space-y-3 px-4 pb-4 -mt-1">
        <div className="card-paper px-2 py-4">
          <div className="grid grid-cols-4 text-center">
            <Stat
              label="玩偶"
              value={String(toys.length)}
              to="/toys"
              highlight
            />
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
  to,
  highlight,
}: {
  label: string
  value: string
  sub?: string
  to?: string
  highlight?: boolean
}) {
  const body = (
    <div className={highlight ? 'rounded-2xl bg-mist-soft py-2' : 'py-2'}>
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

  if (to) {
    return (
      <Link to={to} className="block px-1 active:scale-95 transition-transform">
        {body}
      </Link>
    )
  }

  return body
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
