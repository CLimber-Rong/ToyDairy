import type { ReactNode } from 'react'

export function EmptyState({
  emoji = '🧸',
  title,
  desc,
  action,
}: {
  emoji?: string
  title: string
  desc?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-14 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-mustard-soft text-3xl shadow-[var(--shadow-warm-sm)]">
        {emoji}
      </div>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      {desc && (
        <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-ink-muted">
          {desc}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
