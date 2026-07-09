import { createContext, useContext, useEffect, useState } from 'react'

// The two possible themes
type Theme = 'dark' | 'light'

// Shape of the context value — what components can access
interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

// Create the context with undefined as default
// (we will always use this inside ThemeProvider so it will never be undefined)
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // On first load, check if the user previously chose a theme
    // localStorage persists data across browser sessions
    const stored = localStorage.getItem('algovision-theme') as Theme | null
    return stored ?? 'dark' // default to dark mode
  })

  useEffect(() => {
    const root = document.documentElement // this is the <html> element

    // Tailwind dark mode works by adding/removing 'dark' class on <html>
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Save the choice so it persists after page refresh
    localStorage.setItem('algovision-theme', theme)
  }, [theme]) // runs every time 'theme' changes

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook — components call useTheme() to get the theme and toggle function
// This is cleaner than calling useContext(ThemeContext) everywhere
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider')
  }
  return context
}
