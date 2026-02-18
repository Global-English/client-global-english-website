"use client"

import * as React from "react"

type ThemeProviderProps = {
  children: React.ReactNode
}

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  React.useEffect(() => {
    const saved = localStorage.getItem("ge-theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const theme = saved === "dark" || (!saved && prefersDark) ? "dark" : "light"

    applyTheme(theme)

    function handleStorage(event: StorageEvent) {
      if (event.key === "ge-theme" && (event.newValue === "light" || event.newValue === "dark")) {
        applyTheme(event.newValue)
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  return <>{children}</>
}
