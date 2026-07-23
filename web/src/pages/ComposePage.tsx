import { useEffect, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ImagePlus, MapPin, ScanText, X } from 'lucide-react'
import { api } from '../api/client'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'

interface ComposeRouteState {
  mode?: 'photo' | 'text'
  imageUrl?: string
  ocrText?: string
  fromCamera?: boolean
}

export function ComposePage() {
  const nav = useNavigate()
  const routeState = useLocation().state as ComposeRouteState | null
  const { currentToy, toys, setCurrentToyId, refreshEntries, showToast } =
    useApp()
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [location, setLocation] = useState('')
  const [userNote, setUserNote] = useState(routeState?.ocrText || '')
  const [imageUrl, setImageUrl] = useState<string | undefined>(routeState?.imageUrl)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!currentToy && toys[0]) setCurrentToyId(toys[0].id)
  }, [currentToy, toys, setCurrentToyId])

  useEffect(() => {
    if (routeState?.imageUrl) setImageUrl(routeState.imageUrl)
    if (routeState?.mode === 'text') setImageUrl(undefined)
    if (routeState?.ocrText) setUserNote(routeState.ocrText)
  }, [routeState?.imageUrl, routeState?.mode, routeState?.ocrText])

  function onPickFile(file: File | null) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件')
      return
    }
    if (file.size > 12 * 1024 * 1024) {
      showToast('图片请小于 12MB')
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
        type: imageUrl ? 'daily' : 'text',
        date,
        location: location.trim() || undefined,
        userNote: userNote.trim() || undefined,
        imageUrl,
      })
      await refreshEntries(currentToy.id)
      showToast('日志已生成')
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
        <PageHeader title="编辑记录" back="/archive" soft />
        <div className="px-4 py-12 text-center text-sm text-ink-muted">
          请先在「玩偶」页创建一只玩偶
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="编辑记录" back="/archive" soft />
      <form onSubmit={onSubmit} className="space-y-5 px-4 py-4">
        {imageUrl && (
          <div>
            <div className="relative overflow-hidden rounded-[1.25rem] bg-cream-dark shadow-[var(--shadow-warm-sm)]">
              <img
                src={imageUrl}
                alt="已选照片"
                className="max-h-64 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImageUrl(undefined)}
                className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-ink/75 text-white backdrop-blur-sm"
                aria-label="移除照片"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {routeState?.fromCamera && (
              <div className="mt-2 flex items-center gap-2 rounded-xl bg-mist-soft px-3 py-2 text-[10px] text-matcha-deep">
                <ScanText className="h-3.5 w-3.5 shrink-0" />
                {routeState.ocrText
                  ? '已自动识别照片中的文字，并填入下方描述'
                  : '照片已拍摄完成，画面中没有识别到清晰文字'}
              </div>
            )}
          </div>
        )}

        <div>
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">
            关联玩偶
          </span>
          <select
            className="input !rounded-2xl"
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

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">
            日期
          </span>
          <input
            type="date"
            className="input !rounded-2xl"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">
            地点
          </span>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              className="input !rounded-2xl !pl-10"
              placeholder="例如：鼓浪屿"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">
            描述
          </span>
          <textarea
            className="input min-h-[120px] resize-none !rounded-2xl"
            placeholder="想对玩偶说的话…"
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
          />
        </label>

        {!imageUrl && routeState?.mode !== 'text' && (
          <div>
            <span className="mb-1.5 block text-xs font-medium text-ink-soft">
              照片
            </span>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl bg-paper py-10 text-ink-muted shadow-[var(--shadow-warm-sm)] active:opacity-90">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mustard-soft text-matcha-deep">
                <ImagePlus className="h-6 w-6" />
              </span>
              <span className="text-sm">从相册选择</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full py-3.5 text-sm"
        >
          {submitting ? '正在生成日志…' : '保存并生成日志'}
        </button>
      </form>
    </>
  )
}
