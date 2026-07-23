import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export function PageHeader({
  title,
  subtitle,
  back,
  right,
  soft,
}: {
  title: string
  subtitle?: string
  back?: boolean | string
  right?: ReactNode
  /** mint band background like home header */
  soft?: boolean
}) {
  const nav = useNavigate()
  return (
    <header
      className={`sticky top-0 z-10 flex items-center gap-2 px-3 py-3 ${
        soft
          ? 'header-band'
          : 'bg-paper/95 backdrop-blur-md border-b border-line/60'
      }`}
    >
      {back !== undefined && back !== false && (
        <button
          type="button"
          onClick={() => {
            if (typeof back === 'string') nav(back)
            else nav(-1)
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink-soft shadow-[var(--shadow-warm-sm)] active:opacity-80"
          aria-label="返回"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="font-display truncate text-lg text-ink">{title}</h1>
        {subtitle && (
          <p className="truncate text-xs text-ink-muted">{subtitle}</p>
        )}
      </div>
      {right}
    </header>
  )
}
