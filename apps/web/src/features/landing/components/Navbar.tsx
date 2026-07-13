import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Menu, X, Zap } from 'lucide-react'
import { useTheme } from '@/shared/theme/ThemeProvider'
import { cn } from '@/shared/lib/utils'

const NAV_LINKS = [
  { label: 'Visualizer',  href: '/visualizer' },
  { label: 'Lab',         href: '/lab' },
  { label: 'Playground',  href: '/playground' },
  { label: 'Quiz',        href: '/quiz' },
  { label: 'Dashboard',   href: '/dashboard' },
]

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen,    setIsMenuOpen]    = useState(false)
  const [isScrolled,    setIsScrolled]    = useState(false)
  const location = useLocation()

  // Add background blur when user scrolls down
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-gray-950/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50 shadow-lg'
          : 'bg-transparent'
      )}
    >
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="AlgoVision home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 shadow-lg shadow-brand-500/25 transition-transform group-hover:scale-110">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-100 dark:text-gray-100">
              Algo<span className="text-brand-400">Vision</span>
            </span>
          </Link>

          {/* ── Desktop Navigation Links ── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  location.pathname === link.href
                    ? 'bg-brand-500/10 text-brand-400'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Right Side: Theme Toggle + Auth Buttons ── */}
          <div className="flex items-center gap-2">

            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-all duration-200"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{    rotate:  90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark'
                    ? <Sun  className="h-4 w-4" />
                    : <Moon className="h-4 w-4" />
                  }
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Auth buttons — desktop only */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/auth/login"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/auth/register"
                className="px-4 py-2 text-sm font-medium bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-all duration-200 shadow-lg shadow-brand-500/25"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-all"
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen
                ? <X    className="h-5 w-5" />
                : <Menu className="h-5 w-5" />
              }
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{    opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-gray-800"
            >
              <div className="py-3 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'block px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      location.pathname === link.href
                        ? 'bg-brand-500/10 text-brand-400'
                        : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-gray-800 flex flex-col gap-2 px-4">
                  <Link
                    to="/auth/login"
                    className="py-2 text-sm font-medium text-gray-300 hover:text-white"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/auth/register"
                    className="py-2 px-4 text-sm font-medium bg-brand-500 text-white rounded-lg text-center"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
