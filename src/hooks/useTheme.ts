import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'
export const THEME_KEY = 'italian-b1-verb-master:theme'

function initialTheme(): Theme {
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) return 'dark'
  return 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(THEME_KEY, next)
      } catch {
        // ignore unavailable storage
      }
      return next
    })
  }, [])

  return { theme, toggle }
}
