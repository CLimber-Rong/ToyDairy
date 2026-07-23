import type { Toy } from '../types'

export function ToyCard({ toy }: { toy: Toy }) {
  return (
    <article className="card-paper overflow-hidden">
      <div className="flex gap-3.5 p-4">
        <div className="relative flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-2xl bg-mustard-soft text-[2.25rem]">
          {toy.avatarUrl ? (
            <img
              src={toy.avatarUrl}
              alt={toy.name}
              className="h-full w-full rounded-2xl object-cover"
            />
          ) : (
            '🧸'
          )}
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-mint-deep text-[10px] text-white shadow-sm">
            ★
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-ink-muted">{toy.role}</p>
          <h2 className="font-display mt-0.5 truncate text-xl text-ink">
            {toy.name}
          </h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {toy.zodiac && <span className="tag tag-mustard">{toy.zodiac}</span>}
            {toy.traits.slice(0, 3).map((t) => (
              <span key={t} className="tag tag-mist">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-line/70 px-4 py-3.5">
        <dl className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-2xl bg-cream px-3 py-2.5">
            <dt className="text-ink-muted">出生日期</dt>
            <dd className="mt-0.5 font-medium text-ink">{toy.birthDate}</dd>
          </div>
          <div className="rounded-2xl bg-cream px-3 py-2.5">
            <dt className="text-ink-muted">出生地</dt>
            <dd className="mt-0.5 truncate font-medium text-ink">
              {toy.birthPlace}
            </dd>
          </div>
        </dl>

        {toy.bio && (
          <p className="text-sm leading-relaxed text-ink-soft">{toy.bio}</p>
        )}

        {toy.monologue && (
          <blockquote className="rounded-2xl bg-mustard-soft/80 px-3.5 py-3 text-sm text-ink-soft">
            「{toy.monologue}」
          </blockquote>
        )}
      </div>
    </article>
  )
}
