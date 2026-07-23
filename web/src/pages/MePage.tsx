import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'

export function MePage() {
  const { toys, entries, currentToy, resetDemo, showToast } = useApp()

  return (
    <>
      <PageHeader title="我的" />
      <div className="space-y-4 px-4 py-4">
        <div className="card-paper flex items-center gap-4 rounded-2xl p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-dark text-2xl">
            👤
          </div>
          <div>
            <h2 className="font-medium text-ink">演示账号</h2>
            <p className="text-xs text-ink-muted">demo@toydairy.local</p>
          </div>
        </div>

        <div className="card-paper grid grid-cols-3 gap-2 rounded-2xl p-4 text-center">
          <div>
            <div className="font-display text-xl">{toys.length}</div>
            <div className="text-[11px] text-ink-muted">玩偶</div>
          </div>
          <div>
            <div className="font-display text-xl">{entries.length}</div>
            <div className="text-[11px] text-ink-muted">当前日志</div>
          </div>
          <div>
            <div className="font-display text-xl truncate px-1 text-base leading-8">
              {currentToy?.name ?? '—'}
            </div>
            <div className="text-[11px] text-ink-muted">当前玩偶</div>
          </div>
        </div>

        <div className="card-paper rounded-2xl p-4 text-sm text-ink-soft leading-relaxed">
          <p className="font-medium text-ink">前端 Mock 说明</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-ink-muted">
            <li>数据存在浏览器 localStorage，刷新不丢</li>
            <li>接口形状对齐 plan.md，后端就绪后改 api/client.ts</li>
            <li>上传图片仅为本地预览，未接 R2</li>
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
