import { MapPinned } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'

export function GrowthPage() {
  const { currentToy, entries } = useApp()

  const cities = Array.from(
    new Set(
      entries
        .map((e) => e.location)
        .filter((x): x is string => Boolean(x && x !== '家')),
    ),
  )
  const days = currentToy
    ? Math.max(
        1,
        Math.ceil(
          (Date.now() - new Date(currentToy.createdAt).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0

  return (
    <>
      <PageHeader
        title="成长档案"
        subtitle={currentToy ? currentToy.name : '占位页'}
        soft
      />
      <div className="space-y-3 px-4 py-4">
        <div className="card-paper p-4">
          <p className="text-xs text-ink-muted">MVP 占位 · 后续接地图</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <Stat label="陪伴天数" value={String(days)} />
            <Stat label="记录数" value={String(entries.length)} />
            <Stat label="到访地点" value={String(cities.length)} />
          </div>
        </div>

        <div className="card-paper p-4">
          <h3 className="flex items-center gap-2 font-medium text-ink">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-mist-soft text-lg">
              <MapPinned className="h-4 w-4 text-matcha-deep" />
            </span>
            城市列表
          </h3>
          {cities.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">还没有旅行地点</p>
          ) : (
            <ul className="mt-3 flex flex-wrap gap-2">
              {cities.map((c) => (
                <li key={c} className="tag tag-mist text-sm !px-3 !py-1">
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-cream px-2 py-3">
      <div className="font-display text-2xl text-matcha-deep">{value}</div>
      <div className="mt-0.5 text-[11px] text-ink-muted">{label}</div>
    </div>
  )
}
