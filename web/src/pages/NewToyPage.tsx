import { useState, type FormEvent } from 'react'
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
      <PageHeader title="新建玩偶" back />
      <form onSubmit={onSubmit} className="space-y-5 px-4 py-4">
        <Field label="玩偶名称">
          <input
            className="input"
            placeholder="例如：小熊 Luna"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
          />
        </Field>
        <Field label="出生日期">
          <input
            type="date"
            className="input"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </Field>
        <Field label="出生地">
          <input
            className="input"
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
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  role === r
                    ? 'bg-rose-deep text-white'
                    : 'bg-cream-dark text-ink-soft'
                }`}
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
                  className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                    on ? 'bg-sky/50 text-ink' : 'bg-cream-dark text-ink-soft'
                  }`}
                >
                  {t}
                </button>
              )
            })}
          </div>
        </Field>

        <p className="text-xs leading-relaxed text-ink-muted">
          保存后会由 Mock AI 自动补全星座、简介与独白（对接后端后走
          <code className="mx-1 rounded bg-cream-dark px-1">POST /toys</code>
          与 generate-profile）。
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-rose-deep py-3.5 text-sm font-medium text-white shadow-md shadow-rose/30 disabled:opacity-60"
        >
          {submitting ? '生成身份卡中…' : '创建并生成身份卡'}
        </button>
      </form>
      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--color-line);
          background: var(--color-paper);
          padding: 0.75rem 0.875rem;
          font-size: 0.875rem;
          color: var(--color-ink);
          outline: none;
        }
        .input:focus {
          border-color: var(--color-rose);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-rose) 25%, transparent);
        }
      `}</style>
    </>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-soft">{label}</span>
      {children}
    </label>
  )
}
