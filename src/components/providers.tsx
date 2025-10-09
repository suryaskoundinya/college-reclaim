"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/sonner"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }))
  
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setTheme(systemTheme)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", theme)
      document.documentElement.classList.toggle("dark", theme === "dark")
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div className={theme}>
        <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={false}>
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: theme === "dark" ? "rgba(31, 41, 55, 0.95)" : "rgba(255, 255, 255, 0.95)",
                  backdropFilter: 'blur(10px)',
                  border: theme === "dark" ? "1px solid rgba(139, 92, 246, 0.3)" : "1px solid rgba(139, 92, 246, 0.2)",
                  color: theme === "dark" ? "white" : "black",
                },
              }}
            />
          </QueryClientProvider>
        </SessionProvider>
      </div>
    </ThemeContext.Provider>
  )
}