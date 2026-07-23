import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  applyTheme,
  loadStoredTheme,
  storeTheme,
  THEMES,
  type ThemeId,
  type ThemeMeta,
} from './themes'

interface ThemeContextValue {
  themeId: ThemeId
  theme: ThemeMeta
  setThemeId: (id: ThemeId) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    if (typeof window === 'undefined') return 'mint'
    const id = loadStoredTheme()
    applyTheme(id)
    return id
  })

  useEffect(() => {
    applyTheme(themeId)
    storeTheme(themeId)
  }, [themeId])

  const setThemeId = useCallback((id: ThemeId) => {
    setThemeIdState(id)
  }, [])

  const value = useMemo(() => {
    const t = THEMES[themeId]
    return {
      themeId,
      theme: {
        id: t.id,
        name: t.name,
        desc: t.desc,
        swatches: t.swatches,
        themeColor: t.themeColor,
      },
      setThemeId,
    }
  }, [themeId, setThemeId])

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
