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
      <div className="mb-3 text-4xl">{emoji}</div>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      {desc && <p className="mt-2 text-sm text-ink-muted leading-relaxed">{desc}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
