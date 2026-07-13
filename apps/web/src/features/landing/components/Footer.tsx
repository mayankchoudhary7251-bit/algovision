import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Github, Twitter, Linkedin, Heart } from 'lucide-react'

const FOOTER_LINKS = {
  Platform: [
    { label: 'Visualizer',      href: '/visualizer' },
    { label: 'Performance Lab', href: '/lab' },
    { label: 'Playground',      href: '/playground' },
    { label: 'Quiz',            href: '/quiz' },
    { label: 'Dashboard',       href: '/dashboard' },
  ],
  Learn: [
    { label: 'Sorting Algorithms',  href: '/visualizer' },
    { label: 'Graph Algorithms',    href: '/visualizer' },
    { label: 'Data Structures',     href: '/visualizer' },
    { label: 'Dynamic Programming', href: '/visualizer' },
    { label: 'Interview Prep',      href: '/quiz' },
  ],
  Account: [
    { label: 'Sign Up',    href: '/auth/register' },
    { label: 'Sign In',    href: '/auth/login' },
    { label: 'Dashboard',  href: '/dashboard' },
    { label: 'Settings',   href: '/settings' },
  ],
}

const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/mayankchoudhary7251-bit/algovision',
    icon: Github,
  },
  {
    label: 'Twitter',
    href: '#',
    icon: Twitter,
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: Linkedin,
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-gray-800 bg-gray-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-100">
                Algo<span className="text-brand-400">Vision</span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
              Master Data Structures and Algorithms through interactive
              visualizations, coding practice, and interview preparation.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400 transition-all hover:border-gray-600 hover:text-gray-100"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-sm text-gray-500 transition-colors hover:text-gray-300"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">
            © {currentYear} AlgoVision. Built with{' '}
            <Heart className="inline h-3 w-3 text-rose-500" />{' '}
            as a B.Tech CSE final year project.
          </p>
          <p className="text-xs text-gray-600">
            Open source · MIT License · Free forever
          </p>
        </div>
      </div>
    </footer>
  )
}
