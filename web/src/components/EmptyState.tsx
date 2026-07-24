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
    <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
      <div className="relative mb-5">
        <div className="absolute inset-0 scale-125 rounded-[1.5rem] bg-mint/25 blur-xl" />
        <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.35rem] bg-gradient-to-br from-mustard-soft to-cream text-4xl shadow-[var(--shadow-warm)] ring-1 ring-line/50">
          {emoji}
        </div>
      </div>
      <h3 className="font-display text-xl text-ink">{title}</h3>
      {desc && (
        <p className="mt-2.5 max-w-[16rem] text-sm leading-relaxed text-ink-muted">
          {desc}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
