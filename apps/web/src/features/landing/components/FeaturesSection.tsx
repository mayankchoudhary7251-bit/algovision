import { motion } from 'framer-motion'
import {
  Play,
  Code2,
  FlaskConical,
  BookOpen,
  Trophy,
  BarChart3,
  Users,
  Zap,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Play,
    title: 'Interactive Visualizations',
    description:
      'Watch algorithms execute step by step. Control playback speed, pause, rewind, and jump to any step.',
    color: 'text-brand-400',
    bg: 'bg-brand-500/10',
    border: 'border-brand-500/20',
  },
  {
    icon: Code2,
    title: 'Multi-Language Playground',
    description:
      'Write and run code in Java, C++, Python, and JavaScript with instant feedback and test case verification.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: FlaskConical,
    title: 'Performance Lab',
    description:
      'Benchmark algorithms head-to-head. Plot execution time and comparison counts as input size grows.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    icon: Trophy,
    title: 'Interview Mode',
    description:
      'Simulate real coding interviews with timed challenges, difficulty levels, and instant scoring.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    icon: BarChart3,
    title: 'Complexity Analysis',
    description:
      'Every algorithm includes time and space complexity breakdowns with best, average, and worst cases.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    icon: BookOpen,
    title: 'Quiz Engine',
    description:
      'Test your knowledge with topic-specific quizzes. Track your score and review detailed explanations.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
  },
  {
    icon: Users,
    title: 'Progress Tracking',
    description:
      'Personal dashboard with completion rings, streaks, and bookmarks to track your learning journey.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
  {
    icon: Zap,
    title: '30+ Algorithms',
    description:
      'Sorting, searching, graph traversal, dynamic programming, backtracking, and string matching — all visualized.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export function FeaturesSection() {
  return (
    <section className="relative bg-gray-950 py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-400">
            Everything you need
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-50 sm:text-4xl">
            One platform.{' '}
            <span className="text-gradient">Every tool.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            AlgoVision combines everything a CS student or interview candidate needs
            into a single, beautifully designed platform.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gray-700 hover:bg-gray-900"
              >
                <div className={`inline-flex rounded-xl border p-3 ${feature.bg} ${feature.border}`}>
                  <Icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-100">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {feature.description}
                </p>
                <div className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent ${feature.color.replace('text-', 'via-')} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
