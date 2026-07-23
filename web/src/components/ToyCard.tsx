import type { Toy } from '../types'

export function ToyCard({ toy }: { toy: Toy }) {
  return (
    <article className="card-paper relative overflow-hidden rounded-2xl p-5">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-rose/20" />
      <div className="absolute -left-4 bottom-8 h-16 w-16 rounded-full bg-honey/20" />

      <div className="relative flex gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-cream-dark text-4xl shadow-inner">
          {toy.avatarUrl ? (
            <img
              src={toy.avatarUrl}
              alt={toy.name}
              className="h-full w-full rounded-2xl object-cover"
            />
          ) : (
            '🧸'
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-ink-muted">{toy.role}</p>
          <h2 className="font-display mt-0.5 truncate text-xl text-ink">{toy.name}</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {toy.zodiac && (
              <span className="rounded-full bg-sky/30 px-2 py-0.5 text-[11px] text-ink-soft">
                {toy.zodiac}
              </span>
            )}
            {toy.traits.map((t) => (
              <span
                key={t}
                className="rounded-full bg-rose/20 px-2 py-0.5 text-[11px] text-ink-soft"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <dl className="relative mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl bg-cream px-3 py-2">
          <dt className="text-ink-muted">出生日期</dt>
          <dd className="mt-0.5 font-medium text-ink">{toy.birthDate}</dd>
        </div>
        <div className="rounded-xl bg-cream px-3 py-2">
          <dt className="text-ink-muted">出生地</dt>
          <dd className="mt-0.5 font-medium text-ink truncate">{toy.birthPlace}</dd>
        </div>
      </dl>

      {toy.bio && (
        <p className="relative mt-4 text-sm leading-relaxed text-ink-soft">{toy.bio}</p>
      )}

      {toy.monologue && (
        <blockquote className="relative mt-4 rounded-xl border border-dashed border-rose/40 bg-rose/10 px-3 py-2.5 text-sm text-ink-soft">
          <span className="text-rose-deep">「</span>
          {toy.monologue}
          <span className="text-rose-deep">」</span>
        </blockquote>
      )}
    </article>
  )
}
