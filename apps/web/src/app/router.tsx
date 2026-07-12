import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/features/landing/components/Navbar'
import { HeroSection } from '@/features/landing/components/HeroSection'
import { FeaturesSection } from '@/features/landing/components/FeaturesSection'
import { StatsSection } from '@/features/landing/components/StatsSection'
import { AlgorithmsSection } from '@/features/landing/components/AlgorithmsSection'
import { TechStackSection } from '@/features/landing/components/TechStackSection'

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
    <div className="bg-gray-950">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <AlgorithmsSection />
        <TechStackSection />
      </main>
    </div>
  )
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/visualizer" element={<ComingSoonPage title="Algorithm Visualizer" />} />
      <Route path="/lab" element={<ComingSoonPage title="Performance Lab" />} />
      <Route path="/quiz" element={<ComingSoonPage title="Quiz" />} />
      <Route path="/playground" element={<ComingSoonPage title="Coding Playground" />} />
      <Route path="/dashboard" element={<ComingSoonPage title="Dashboard" />} />
    </Routes>
  )
}