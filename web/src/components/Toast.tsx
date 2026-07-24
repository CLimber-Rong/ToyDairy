import { useApp } from '../context/AppContext'

export function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-28 z-50 flex justify-center px-6">
      <div className="toast-enter max-w-[90%] rounded-full border border-white/10 bg-ink/92 px-5 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-elevated)] backdrop-blur-md">
        {toast.message}
      </div>
    </div>
  )
}
