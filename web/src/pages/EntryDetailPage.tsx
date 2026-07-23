import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MapPin, RefreshCw } from 'lucide-react'
import { api } from '../api/client'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import type { Entry } from '../types'
import { ENTRY_TYPE_LABEL } from '../types'

export function EntryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const { showToast, refreshEntries, currentToy } = useApp()
  const [entry, setEntry] = useState<Entry | null>(null)
  const [loading, setLoading] = useState(true)
  const [regen, setRegen] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const e = await api.getEntry(id)
        if (!cancelled) setEntry(e)
      } catch {
        if (!cancelled) {
          showToast('记录不存在')
          nav('/timeline')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, nav, showToast])

  async function onRegenerate() {
    if (!entry) return
    setRegen(true)
    try {
      const next = await api.regenerateEntry(entry.id)
      setEntry(next)
      if (currentToy) await refreshEntries(currentToy.id)
      showToast('已重新生成日记')
    } catch (err) {
      showToast(err instanceof Error ? err.message : '生成失败')
    } finally {
      setRegen(false)
    }
  }

  if (loading || !entry) {
    return (
      <>
        <PageHeader title="详情" back="/timeline" />
        <div className="py-16 text-center text-sm text-ink-muted">加载中…</div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title={entry.title || '日记详情'}
        back="/timeline"
        right={
          <button
            type="button"
            onClick={onRegenerate}
            disabled={regen}
            className="flex h-9 items-center gap-1 rounded-full bg-cream-dark px-3 text-xs text-ink-soft disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${regen ? 'animate-spin' : ''}`} />
            重写
          </button>
        }
      />
      <article className="px-4 py-4">
        {entry.imageUrl && (
          <div className="mb-4 overflow-hidden rounded-2xl">
            <img
              src={entry.imageUrl}
              alt=""
              className="max-h-64 w-full object-cover"
            />
          </div>
        )}

        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-cream-dark px-2.5 py-1 text-ink-soft">
            {ENTRY_TYPE_LABEL[entry.type]}
          </span>
          <time className="text-ink-muted">{entry.date}</time>
          {entry.mood && (
            <span className="rounded-full bg-honey/40 px-2.5 py-1 text-ink-soft">
              {entry.mood}
            </span>
          )}
        </div>

        {entry.location && (
          <p className="mb-4 flex items-center gap-1 text-sm text-ink-soft">
            <MapPin className="h-4 w-4 text-rose" />
            {entry.location}
          </p>
        )}

        {entry.userNote && (
          <p className="mb-4 rounded-xl bg-cream-dark/60 px-3 py-2 text-sm text-ink-soft">
            <span className="text-xs text-ink-muted">主人备注 · </span>
            {entry.userNote}
          </p>
        )}

        <div className="card-paper rounded-2xl p-4">
          <h2 className="font-display mb-3 text-base text-ink">玩偶日记</h2>
          <div className="whitespace-pre-wrap text-sm leading-7 text-ink-soft">
            {entry.aiDiary || '（暂无 AI 文案）'}
          </div>
        </div>
      </article>
    </>
  )
}
