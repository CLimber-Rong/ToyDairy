import type { Toy } from '../types'

export function ToyCard({ toy }: { toy: Toy }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="flex gap-4 bg-terra-soft px-4 py-4">
        <div className="flex h-[4.25rem] w-[4.25rem] shrink-0 items-center justify-center rounded-2xl bg-paper text-[2.25rem] border border-line">
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
          <p className="text-[11px] text-ink-muted">{toy.role}</p>
          <h2 className="font-display mt-0.5 truncate text-xl text-ink">
            {toy.name}
          </h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {toy.zodiac && <span className="tag tag-mist">{toy.zodiac}</span>}
            {toy.traits.slice(0, 2).map((t) => (
              <span key={t} className="tag tag-cream">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 px-4 py-4">
        {toy.traits.length > 2 && (
          <div className="flex flex-wrap gap-1.5">
            {toy.traits.slice(2).map((t) => (
              <span key={t} className="tag tag-mist">
                {t}
              </span>
            ))}
          </div>
        )}

        <dl className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl bg-cream px-3 py-2.5">
            <dt className="text-ink-muted">出生日期</dt>
            <dd className="mt-0.5 font-medium text-ink">{toy.birthDate}</dd>
          </div>
          <div className="rounded-xl bg-cream px-3 py-2.5">
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
          <blockquote className="rounded-xl bg-mustard-soft px-3.5 py-3 text-sm text-ink-soft">
            「{toy.monologue}」
          </blockquote>
        )}
      </div>
    </article>
  )
}
