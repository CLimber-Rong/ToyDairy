import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import type { Entry } from '../types'
import { ENTRY_TYPE_LABEL } from '../types'

export function EntryCard({ entry }: { entry: Entry }) {
  return (
    <Link
      to={`/entries/${entry.id}`}
      className="block overflow-hidden rounded-2xl border border-line bg-paper active:opacity-90"
    >
      {entry.imageUrl && (
        <div className="aspect-[16/10] bg-cream-dark">
          <img
            src={entry.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="tag tag-mist">{ENTRY_TYPE_LABEL[entry.type]}</span>
          <time className="text-xs text-ink-muted">{entry.date}</time>
        </div>
        <h3 className="mt-2 font-medium text-ink line-clamp-1">
          {entry.title || entry.location || '无题记录'}
        </h3>
        {entry.location && (
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
            <MapPin className="h-3 w-3" />
            {entry.location}
          </p>
        )}
        {entry.aiDiary && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
            {entry.aiDiary}
          </p>
        )}
      </div>
    </Link>
  )
}
