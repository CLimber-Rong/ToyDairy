import { useApp } from '../context/AppContext'

export function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  return (
    <div className="pointer-events-none absolute bottom-24 inset-x-0 z-50 flex justify-center px-6">
      <div className="toast-enter max-w-[90%] rounded-full bg-ink/90 px-4 py-2.5 text-sm text-white shadow-[var(--shadow-elevated)]">
        {toast.message}
      </div>
    </div>
  )
}
