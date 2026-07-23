import { Link } from 'react-router-dom'
import { Check, Plus } from 'lucide-react'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { ToyCard } from '../components/ToyCard'
import { useApp } from '../context/AppContext'

export function ToysPage() {
  const { toys, currentToy, setCurrentToyId, showToast } = useApp()

  return (
    <>
      <PageHeader
        title="我的玩偶"
        soft
        right={
          <Link to="/toys/new" className="btn-primary h-9 px-3.5 text-xs">
            <Plus className="h-4 w-4" />
            新增
          </Link>
        }
      />
      <div className="space-y-4 px-4 py-4">
        {toys.length === 0 ? (
          <EmptyState
            title="还没有玩偶"
            desc="创建第一只玩偶，生成身份卡吧。"
            action={
              <Link to="/toys/new" className="btn-primary px-6 py-2.5 text-sm">
                新建玩偶
              </Link>
            }
          />
        ) : (
          toys.map((toy) => {
            const active = currentToy?.id === toy.id
            return (
              <div key={toy.id} className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentToyId(toy.id)
                    showToast(`已切换到 ${toy.name}`)
                  }}
                  className={
                    active
                      ? 'chip chip-active inline-flex items-center gap-1 !py-1.5 !text-xs'
                      : 'chip inline-flex items-center gap-1 !py-1.5 !text-xs'
                  }
                >
                  {active && <Check className="h-3.5 w-3.5" />}
                  {active ? '当前选中' : '切换为当前'}
                </button>
                <ToyCard toy={toy} />
              </div>
            )
          })
        )}
      </div>
    </>
  )
}
