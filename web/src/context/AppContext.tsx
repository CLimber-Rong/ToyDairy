import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api } from '../api/client'
import type { Entry, Toy } from '../types'

interface Toast {
  id: number
  message: string
}

interface AppContextValue {
  toys: Toy[]
  currentToy: Toy | null
  entries: Entry[]
  loading: boolean
  toast: Toast | null
  showToast: (message: string) => void
  refreshToys: () => Promise<void>
  refreshEntries: (toyId?: string) => Promise<void>
  setCurrentToyId: (id: string) => void
  resetDemo: () => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [toys, setToys] = useState<Toy[]>([])
  const [currentToyId, setCurrentToyIdState] = useState<string | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<Toast | null>(null)

  const showToast = useCallback((message: string) => {
    const id = Date.now()
    setToast({ id, message })
    window.setTimeout(() => {
      setToast((t) => (t?.id === id ? null : t))
    }, 2400)
  }, [])

  const refreshToys = useCallback(async () => {
    const list = await api.listToys()
    setToys(list)
    const saved = api.getCurrentToyId()
    const next =
      (saved && list.find((t) => t.id === saved)?.id) ||
      list[0]?.id ||
      null
    setCurrentToyIdState(next)
    if (next) api.setCurrentToyId(next)
  }, [])

  const refreshEntries = useCallback(async (toyId?: string) => {
    const id = toyId ?? currentToyId
    if (!id) {
      setEntries([])
      return
    }
    const list = await api.listEntries(id)
    setEntries(list)
  }, [currentToyId])

  const setCurrentToyId = useCallback(
    (id: string) => {
      api.setCurrentToyId(id)
      setCurrentToyIdState(id)
    },
    [],
  )

  const resetDemo = useCallback(async () => {
    api.resetDemo()
    await refreshToys()
    showToast('已恢复演示数据')
  }, [refreshToys, showToast])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        await refreshToys()
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refreshToys])

  useEffect(() => {
    if (!currentToyId) {
      setEntries([])
      return
    }
    void refreshEntries(currentToyId)
  }, [currentToyId, refreshEntries])

  const currentToy = useMemo(
    () => toys.find((t) => t.id === currentToyId) ?? null,
    [toys, currentToyId],
  )

  const value = useMemo(
    () => ({
      toys,
      currentToy,
      entries,
      loading,
      toast,
      showToast,
      refreshToys,
      refreshEntries,
      setCurrentToyId,
      resetDemo,
    }),
    [
      toys,
      currentToy,
      entries,
      loading,
      toast,
      showToast,
      refreshToys,
      refreshEntries,
      setCurrentToyId,
      resetDemo,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
