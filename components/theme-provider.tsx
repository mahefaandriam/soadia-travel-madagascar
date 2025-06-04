"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextProps {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "system",
  setTheme: () => {},
})

// Define getSystemTheme function outside the component to avoid the initialization error
const getSystemTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    //return "dark"
    return "light" // theme dark desctived
  }
  return "light"
}

export const ThemeProvider = ({
  attribute,
  defaultTheme,
  enableSystem,
  disableTransitionOnChange,
  children,
}: {
  attribute: string
  defaultTheme: Theme
  enableSystem: boolean
  disableTransitionOnChange: boolean
  children: React.ReactNode
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") as Theme | null
      if (storedTheme) {
        return storedTheme
      } else if (enableSystem) {
        return getSystemTheme()
      } else {
        return defaultTheme
      }
    }
    return defaultTheme
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme)
      if (theme === "system") {
        const systemTheme = getSystemTheme()
        document.documentElement.setAttribute(attribute, systemTheme)
      } else {
        document.documentElement.setAttribute(attribute, theme)
      }
    }
  }, [theme, attribute])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
