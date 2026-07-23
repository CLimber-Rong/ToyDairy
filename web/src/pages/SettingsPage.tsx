import { useState, type ReactNode } from 'react'
import { Bell, Database, Moon, Smartphone, Volume2 } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'

export function SettingsPage() {
  const { showToast, resetDemo } = useApp()
  const [notify, setNotify] = useState(true)
  const [sound, setSound] = useState(true)
  const [compact, setCompact] = useState(false)

  return (
    <>
      <PageHeader title="设置" back="/me" soft />
      <div className="space-y-3 px-4 py-4">
        <section className="card-paper overflow-hidden">
          <SectionTitle>通知与声音</SectionTitle>
          <ToggleRow
            icon={<Bell className="h-4 w-4" />}
            label="日记提醒"
            desc="每日提醒写一条手帐"
            on={notify}
            onChange={setNotify}
          />
          <ToggleRow
            icon={<Volume2 className="h-4 w-4" />}
            label="操作音效"
            desc="按钮与完成时的轻提示音"
            on={sound}
            onChange={setSound}
            last
          />
        </section>

        <section className="card-paper overflow-hidden">
          <SectionTitle>显示</SectionTitle>
          <ToggleRow
            icon={<Smartphone className="h-4 w-4" />}
            label="紧凑列表"
            desc="时间轴卡片更紧凑"
            on={compact}
            onChange={setCompact}
          />
          <div className="flex items-center gap-3 border-t border-line/70 px-4 py-3.5">
            <span className="text-matcha-deep">
              <Moon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink">深色模式</p>
              <p className="text-[11px] text-ink-muted">即将支持</p>
            </div>
            <span className="rounded-full bg-cream-dark px-2.5 py-1 text-[10px] text-ink-muted">
              敬请期待
            </span>
          </div>
        </section>

        <section className="card-paper overflow-hidden">
          <SectionTitle>数据</SectionTitle>
          <button
            type="button"
            onClick={async () => {
              await resetDemo()
              showToast('演示数据已重置')
            }}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-cream"
          >
            <span className="text-matcha-deep">
              <Database className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink">重置演示数据</p>
              <p className="text-[11px] text-ink-muted">
                恢复种子玩偶与示例日记
              </p>
            </div>
          </button>
        </section>

        <p className="px-1 text-center text-[11px] text-ink-muted">
          Toy Dairy · 前端 Mock · 设置仅保存在本机会话
        </p>
      </div>
    </>
  )
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="border-b border-line/70 px-4 py-2.5 text-xs font-medium text-ink-muted">
      {children}
    </div>
  )
}

function ToggleRow({
  icon,
  label,
  desc,
  on,
  onChange,
  last,
}: {
  icon: ReactNode
  label: string
  desc: string
  on: boolean
  onChange: (v: boolean) => void
  last?: boolean
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 ${
        last ? '' : 'border-b border-line/70'
      }`}
    >
      <span className="text-matcha-deep">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-ink">{label}</p>
        <p className="text-[11px] text-ink-muted">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          on ? 'bg-matcha' : 'bg-cream-dark'
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
            on ? 'left-5' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  )
}
