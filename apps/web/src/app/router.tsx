import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Navbar } from '@/features/landing/components/Navbar'
import { HeroSection } from '@/features/landing/components/HeroSection'
import { FeaturesSection } from '@/features/landing/components/FeaturesSection'
import { StatsSection } from '@/features/landing/components/StatsSection'
import { AlgorithmsSection } from '@/features/landing/components/AlgorithmsSection'
import { TechStackSection } from '@/features/landing/components/TechStackSection'
import { FAQSection } from '@/features/landing/components/FAQSection'
import { CTASection } from '@/features/landing/components/CTASection'
import { Footer } from '@/features/landing/components/Footer'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { useAuthStore } from '@/features/auth/store/authStore'
import { VisualizerPage } from '@/features/visualizer/pages/VisualizerPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />
  return <>{children}</>
}

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
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export function AppRouter() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid #374151',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#f9fafb' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#f9fafb' } },
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/visualizer" element={<VisualizerPage />} />
        <Route path="/lab" element={<ComingSoonPage title="Performance Lab" />} />
        <Route path="/quiz" element={<ComingSoonPage title="Quiz" />} />
        <Route path="/playground" element={<ComingSoonPage title="Coding Playground" />} />
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
      </Routes>
    </>
  )
}