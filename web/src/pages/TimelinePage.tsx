import { Link } from 'react-router-dom'
import { EntryCard } from '../components/EntryCard'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'

export function TimelinePage() {
  const { currentToy, entries } = useApp()

  if (!currentToy) {
    return (
      <>
        <PageHeader title="旅行日志" />
        <EmptyState
          title="还没有玩偶"
          desc="先创建一只玩偶，再开始记录吧。"
          action={
            <Link to="/toys/new" className="btn-primary px-6 py-2.5 text-sm">
              新建玩偶
            </Link>
          }
        />
      </>
    )
  }

  return (
    <>
      <PageHeader title="旅行日志" subtitle={`当前：${currentToy.name}`} />
      <div className="space-y-3 px-4 py-4">
        <div className="card-hero flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-xs text-ink-muted">手帐记录</p>
            <p className="font-display mt-0.5 text-lg text-ink">
              {entries.length} 段记忆
            </p>
          </div>
          <span className="tag tag-cream">{currentToy.name}</span>
        </div>

        {entries.length === 0 ? (
          <EmptyState
            emoji="📔"
            title="还没有记录"
            desc="点中间的 + 写一条旅行或日常日记。"
            action={
              <Link to="/compose" className="btn-primary px-6 py-2.5 text-sm">
                写一条
              </Link>
            }
          />
        ) : (
          entries.map((e) => <EntryCard key={e.id} entry={e} />)
        )}
      </div>
    </>
  )
}
