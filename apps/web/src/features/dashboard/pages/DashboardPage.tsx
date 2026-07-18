import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle, Clock, Zap, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { dashboardApi } from '../api/dashboard.api'
import { StatCard } from '../components/StatCard'
import { ProgressRing } from '../components/ProgressRing'
import { Navbar } from '@/features/landing/components/Navbar'

const CATEGORY_COLORS: Record<string, string> = {
  SORTING: '#6366f1',
  SEARCHING: '#06b6d4',
  GRAPHS: '#f59e0b',
  TREES: '#10b981',
  DYNAMIC_PROGRAMMING: '#ec4899',
  GREEDY: '#f97316',
  BACKTRACKING: '#8b5cf6',
  DATA_STRUCTURES: '#14b8a6',
}

const DIFFICULTY_COLORS = {
  BEGINNER: 'text-emerald-400 bg-emerald-500/10',
  INTERMEDIATE: 'text-amber-400 bg-amber-500/10',
  ADVANCED: 'text-rose-400 bg-rose-500/10',
}

export function DashboardPage() {
  const { user } = useAuthStore()

  const { data: topics = [] } = useQuery({
    queryKey: ['topics'],
    queryFn: dashboardApi.getTopics,
  })

  const { data: progress = [] } = useQuery({
    queryKey: ['progress'],
    queryFn: dashboardApi.getProgress,
  })

  const completed = progress.filter(p => p.status === 'COMPLETED').length
  const inProgress = progress.filter(p => p.status === 'IN_PROGRESS').length
  const totalProgress = topics.length > 0 ? (completed / topics.length) * 100 : 0

  const categories = [...new Set(topics.map(t => t.category))]
  const categoryProgress = categories.map(cat => {
    const catTopics = topics.filter(t => t.category === cat)
    const catCompleted = progress.filter(p =>
      p.status === 'COMPLETED' && catTopics.some(t => t.id === p.topic?.id)
    ).length
    return {
      name: cat,
      total: catTopics.length,
      completed: catCompleted,
      percent: catTopics.length > 0 ? (catCompleted / catTopics.length) * 100 : 0,
      color: CATEGORY_COLORS[cat] ?? '#6366f1',
    }
  })

  const recentTopics = topics.slice(0, 6)

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-12">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100">
            Welcome back, <span className="text-gradient">{user?.username}</span> 👋
          </h1>
          <p className="mt-1 text-gray-400">Track your DSA learning progress</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
          <StatCard label="Topics Available" value={topics.length} color="text-brand-400" delay={0} subtitle="algorithms & data structures" />
          <StatCard label="Completed" value={completed} color="text-emerald-400" delay={0.1} subtitle="topics mastered" />
          <StatCard label="In Progress" value={inProgress} color="text-amber-400" delay={0.2} subtitle="currently learning" />
          <StatCard label="Overall Progress" value={`${Math.round(totalProgress)}%`} color="text-purple-400" delay={0.3} subtitle="of all topics" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2 rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h2 className="text-lg font-semibold text-gray-100 mb-6">Progress by Category</h2>
            {categoryProgress.length > 0 ? (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {categoryProgress.map(cat => (
                  <ProgressRing
                    key={cat.name}
                    progress={cat.percent}
                    color={cat.color}
                    label={cat.name.replace('_', ' ')}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Start learning to see your progress</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              {[
                { icon: CheckCircle, label: 'Completed', value: completed, color: 'text-emerald-400' },
                { icon: Clock, label: 'In Progress', value: inProgress, color: 'text-amber-400' },
                { icon: BookOpen, label: 'Not Started', value: topics.length - completed - inProgress, color: 'text-gray-400' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span className="text-sm text-gray-400">{label}</span>
                  </div>
                  <span className={`text-sm font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-100">Explore Algorithms</h2>
            <Link to="/visualizer" className="flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentTopics.map((topic, i) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/visualizer?algo=${topic.slug}`}
                  className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-800/30 p-4 hover:border-gray-700 hover:bg-gray-800/60 transition-all group"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-100">{topic.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{topic.category.replace('_', ' ')}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[topic.difficulty]}`}>
                      {topic.difficulty}
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-600 group-hover:text-brand-400 transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
