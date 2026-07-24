import { useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'

const ROLE_OPTIONS = ['旅行搭子', '童年伙伴', '治愈小宠', '冒险伙伴']
const TRAIT_OPTIONS = ['温柔', '胆小', '好奇', '活泼', '话多', '安静', '勇敢', '爱吃']

export function NewToyPage() {
  const nav = useNavigate()
  const { refreshToys, showToast } = useApp()
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('2026-07-23')
  const [birthPlace, setBirthPlace] = useState('')
  const [role, setRole] = useState(ROLE_OPTIONS[0])
  const [traits, setTraits] = useState<string[]>(['温柔', '好奇'])
  const [submitting, setSubmitting] = useState(false)

  function toggleTrait(t: string) {
    setTraits((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t].slice(0, 4),
    )
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !birthPlace.trim()) {
      showToast('请填写名称和出生地')
      return
    }
    if (traits.length === 0) {
      showToast('请至少选一个性格')
      return
    }
    setSubmitting(true)
    try {
      const toy = await api.createToy({
        name: name.trim(),
        birthDate,
        birthPlace: birthPlace.trim(),
        role,
        traits,
      })
      await refreshToys()
      showToast(`${toy.name} 的身份卡已生成`)
      nav('/toys')
    } catch (err) {
      showToast(err instanceof Error ? err.message : '创建失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader title="新建玩偶" back soft />
      <form onSubmit={onSubmit} className="space-y-4 px-4 py-4">
        <div className="card-paper flex items-center gap-3.5 p-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-mustard-soft to-peach-soft text-3xl shadow-[var(--shadow-warm-sm)]">
            🐻
          </span>
          <p className="text-sm leading-relaxed text-ink-soft">
            填写基本信息后，会生成身份卡（星座 · 简介 · 独白）。
          </p>
        </div>

        <Field label="玩偶名称">
          <input
            className="input !rounded-2xl"
            placeholder="例如：小熊 Luna"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
          />
        </Field>
        <Field label="出生日期">
          <input
            type="date"
            className="input !rounded-2xl"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </Field>
        <Field label="出生地">
          <input
            className="input !rounded-2xl"
            placeholder="例如：上海迪士尼"
            value={birthPlace}
            onChange={(e) => setBirthPlace(e.target.value)}
            maxLength={40}
          />
        </Field>
        <Field label="身份">
          <div className="flex flex-wrap gap-2">
            {ROLE_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={role === r ? 'chip chip-active' : 'chip'}
              >
                {r}
              </button>
            ))}
          </div>
        </Field>
        <Field label="性格关键词（最多 4 个）">
          <div className="flex flex-wrap gap-2">
            {TRAIT_OPTIONS.map((t) => {
              const on = traits.includes(t)
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTrait(t)}
                  className={on ? 'chip chip-soft-active' : 'chip'}
                >
                  {t}
                </button>
              )
            })}
          </div>
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full py-3.5 text-sm"
        >
          {submitting ? '生成身份卡中…' : '创建并生成身份卡'}
        </button>
      </form>
    </>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-soft">
        {label}
      </span>
      {children}
    </label>
  )
}
