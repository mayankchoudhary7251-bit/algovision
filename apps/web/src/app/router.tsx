import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'

function ComingSoonPage({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-screen items-center justify-center"
    >
      <div className="text-center">
        <div className="mb-4 text-5xl">🚧</div>
        <h1 className="text-2xl font-bold text-gray-100">{title}</h1>
        <p className="mt-2 text-gray-400">Coming in the next phase...</p>
      </div>
    </motion.div>
  )
}

function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-screen items-center justify-center p-4"
    >
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-500/10 border border-brand-500/20">
          <span className="text-4xl">⚡</span>
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-gradient">
          AlgoVision
        </h1>

        <p className="mt-4 max-w-md text-lg text-gray-400">
          Interactive DSA Visualizer · Coding Playground · Interview Prep
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2 text-sm text-brand-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-400" />
          Phase 0 Complete — Foundation is live!
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {[
            { label: 'Visualizer',      href: '/visualizer' },
            { label: 'Performance Lab', href: '/lab' },
            { label: 'Quiz',            href: '/quiz' },
            { label: 'Playground',      href: '/playground' },
            { label: 'Dashboard',       href: '/dashboard' },
          ].map(({ label, href }) => (
            <a key={href} href={href} className="btn-secondary text-xs">
              {label}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/"           element={<HomePage />} />
      <Route path="/visualizer" element={<ComingSoonPage title="Algorithm Visualizer" />} />
      <Route path="/lab"        element={<ComingSoonPage title="Performance Lab" />} />
      <Route path="/quiz"       element={<ComingSoonPage title="Quiz & Interview Mode" />} />
      <Route path="/playground" element={<ComingSoonPage title="Coding Playground" />} />
      <Route path="/dashboard"  element={<ComingSoonPage title="Dashboard" />} />
    </Routes>
  )
}
