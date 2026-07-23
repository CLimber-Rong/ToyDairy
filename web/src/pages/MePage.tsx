import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'

export function MePage() {
  const { toys, entries, currentToy, resetDemo, showToast } = useApp()

  return (
    <>
      <PageHeader title="我的" />
      <div className="space-y-3 px-4 py-4">
        <div className="card-paper flex items-center gap-4 rounded-2xl p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-dark text-2xl">
            👤
          </div>
          <div>
            <h2 className="font-medium text-ink">演示账号</h2>
            <p className="text-xs text-ink-muted">demo@toydairy.local</p>
          </div>
        </div>

        <div className="card-paper grid grid-cols-3 gap-2 rounded-2xl p-4 text-center">
          <div className="rounded-xl bg-cream py-3">
            <div className="font-display text-xl text-ink">{toys.length}</div>
            <div className="text-[11px] text-ink-muted">玩偶</div>
          </div>
          <div className="rounded-xl bg-cream py-3">
            <div className="font-display text-xl text-ink">{entries.length}</div>
            <div className="text-[11px] text-ink-muted">当前日志</div>
          </div>
          <div className="rounded-xl bg-cream px-1 py-3">
            <div className="font-display truncate text-base leading-7 text-ink">
              {currentToy?.name ?? '—'}
            </div>
            <div className="text-[11px] text-ink-muted">当前玩偶</div>
          </div>
        </div>

        <div className="card-paper rounded-2xl p-4 text-sm text-ink-soft">
          <p className="font-medium text-ink">前端 Mock 说明</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-ink-muted">
            <li>数据存在浏览器 localStorage</li>
            <li>接口对齐 plan.md，后端就绪改 api/client.ts</li>
            <li>图片仅本地预览，未接 R2</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={async () => {
            await resetDemo()
            showToast('演示数据已重置')
          }}
          className="w-full rounded-2xl border border-line bg-paper py-3 text-sm text-ink-soft"
        >
          重置演示数据
        </button>
      </div>
    </>
  )
}
