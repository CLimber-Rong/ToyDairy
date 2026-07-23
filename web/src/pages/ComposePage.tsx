import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImagePlus, X } from 'lucide-react'
import { api } from '../api/client'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import type { EntryType } from '../types'
import { ENTRY_TYPE_LABEL, MOOD_OPTIONS } from '../types'

const TYPES: EntryType[] = ['travel', 'daily', 'text', 'memorial']

export function ComposePage() {
  const nav = useNavigate()
  const { currentToy, toys, setCurrentToyId, refreshEntries, showToast } =
    useApp()
  const [type, setType] = useState<EntryType>('travel')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [location, setLocation] = useState('')
  const [title, setTitle] = useState('')
  const [userNote, setUserNote] = useState('')
  const [mood, setMood] = useState('')
  const [imageUrl, setImageUrl] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!currentToy && toys[0]) setCurrentToyId(toys[0].id)
  }, [currentToy, toys, setCurrentToyId])

  function onPickFile(file: File | null) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('图片请小于 5MB')
      return
    }
    setImageUrl(URL.createObjectURL(file))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!currentToy) {
      showToast('请先选择或创建玩偶')
      return
    }
    setSubmitting(true)
    try {
      const entry = await api.createEntry(currentToy.id, {
        type,
        date,
        location: location.trim() || undefined,
        title: title.trim() || undefined,
        userNote: userNote.trim() || undefined,
        mood: mood || undefined,
        imageUrl,
      })
      await refreshEntries(currentToy.id)
      showToast('日记已生成')
      nav(`/entries/${entry.id}`)
    } catch (err) {
      showToast(err instanceof Error ? err.message : '保存失败')
    } finally {
      setSubmitting(false)
    }
  }

  if (!currentToy) {
    return (
      <>
        <PageHeader title="编辑记录" back="/timeline" />
        <div className="px-4 py-12 text-center text-sm text-ink-muted">
          请先在「玩偶」页创建一只玩偶
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="编辑记录" back="/timeline" subtitle={currentToy.name} />
      <form onSubmit={onSubmit} className="space-y-5 px-4 py-4">
        <div>
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">
            关联玩偶
          </span>
          <select
            className="input"
            value={currentToy.id}
            onChange={(e) => setCurrentToyId(e.target.value)}
          >
            {toys.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">
            记录类型
          </span>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={type === t ? 'chip chip-active' : 'chip'}
              >
                {ENTRY_TYPE_LABEL[t]}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">
            日期
          </span>
          <input
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">
            地点
          </span>
          <input
            className="input"
            placeholder="例如：鼓浪屿"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">
            标题
          </span>
          <input
            className="input"
            placeholder="可选"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">
            补充描述
          </span>
          <textarea
            className="input min-h-[88px] resize-none"
            placeholder="想对玩偶说的话…"
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
          />
        </label>

        <div>
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">
            心情
          </span>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(mood === m ? '' : m)}
                className={mood === m ? 'chip chip-soft-active' : 'chip'}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">
            照片
          </span>
          {imageUrl ? (
            <div className="relative overflow-hidden rounded-2xl border border-line">
              <img
                src={imageUrl}
                alt=""
                className="max-h-48 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImageUrl(undefined)}
                className="absolute right-2 top-2 rounded-full bg-ink/80 p-1.5 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-paper py-10 text-ink-muted active:bg-cream">
              <ImagePlus className="h-7 w-7 text-terra-deep" />
              <span className="text-sm">从相册选择</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
              />
            </label>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full py-3.5 text-sm"
        >
          {submitting ? 'AI 写日记中…' : '保存并生成日记'}
        </button>
      </form>
    </>
  )
}
