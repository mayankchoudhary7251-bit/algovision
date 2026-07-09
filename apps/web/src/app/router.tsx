import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/features/landing/components/Navbar'

function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-5xl">🚧</div>
        <h1 className="text-2xl font-bold text-gray-100">{title}</h1>
        <p className="mt-2 text-gray-400">Coming soon...</p>
      </div>
    </div>
  )
}

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 dark:bg-gray-950">
      <Navbar />
      <main className="pt-16">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-gradient">AlgoVision</h1>
            <p className="mt-4 text-gray-400">Landing page coming next...</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/"           element={<HomePage />} />
      <Route path="/visualizer" element={<ComingSoonPage title="Algorithm Visualizer" />} />
      <Route path="/lab"        element={<ComingSoonPage title="Performance Lab" />} />
      <Route path="/quiz"       element={<ComingSoonPage title="Quiz" />} />
      <Route path="/playground" element={<ComingSoonPage title="Coding Playground" />} />
      <Route path="/dashboard"  element={<ComingSoonPage title="Dashboard" />} />
    </Routes>
  )
}
