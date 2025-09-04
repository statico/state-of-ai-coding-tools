'use client'

import * as React from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Initialize theme on mount
    const savedTheme = localStorage.getItem('theme') || 'system'
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (savedTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(savedTheme)
    }
  }, [])

  return <>{children}</>
}
