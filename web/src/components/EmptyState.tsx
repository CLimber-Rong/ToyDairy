import type { ReactNode } from 'react'

export function EmptyState({
  title,
  desc,
  action,
}: {
  title: string
  desc?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-14 text-center">
      <div className="mb-4 h-1 w-10 rounded-full bg-matcha/40" />
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
