import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Github, Play } from 'lucide-react'

function generateBubbleSortSteps(arr) {
  const steps = []
  const a = [...arr]
  const sorted = []
  steps.push({ array: [...a], comparing: null, sorted: [] })
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      steps.push({ array: [...a], comparing: [j, j + 1], sorted: [...sorted] })
      if (a[j] > a[j + 1]) {
        const tmp = a[j]
        a[j] = a[j + 1]
        a[j + 1] = tmp
        steps.push({ array: [...a], comparing: [j, j + 1], sorted: [...sorted] })
      }
    }
    sorted.unshift(a.length - 1 - i)
  }
  sorted.unshift(0)
  steps.push({ array: [...a], comparing: null, sorted: [...sorted] })
  return steps
}

const INITIAL_ARRAY = [8, 3, 6, 1, 9, 2, 7, 4, 5]
const STEPS = generateBubbleSortSteps(INITIAL_ARRAY)

function SortingVisualizer() {
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    if (!isPlaying) return
    if (stepIndex >= STEPS.length - 1) {
      const timer = setTimeout(() => setStepIndex(0), 2000)
      return () => clearTimeout(timer)
    }
    const timer = setTimeout(() => setStepIndex((i) => i + 1), 320)
    return () => clearTimeout(timer)
  }, [stepIndex, isPlaying])

  const { array, comparing, sorted } = STEPS[stepIndex]
  const maxVal = Math.max(...array)

  function getBarColor(index) {
    if (sorted.includes(index)) return '#10b981'
    if (comparing !== null && comparing.includes(index)) return '#f59e0b'
    return '#6366f1'
  }

  return (
    <div className="relative rounded-2xl border border-gray-700/50 bg-gray-900/80 backdrop-blur-sm p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/70" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <div className="h-3 w-3 rounded-full bg-green-500/70" />
        </div>
        <span className="ml-2 text-xs text-gray-500 font-mono">bubble-sort.ts</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-500">
            Step {stepIndex + 1} / {STEPS.length}
          </span>
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="p-1 rounded text-gray-400 hover:text-gray-100 transition-colors"
          >
            {isPlaying ? (
              <span className="text-xs font-mono text-gray-400">pause</span>
            ) : (
              <Play className="h-3 w-3" />
            )}
          </button>
        </div>
      </div>
      <div className="flex items-end justify-center gap-2 h-40">
        {array.map((value, index) => (
          <div key={index} className="flex flex-col items-center gap-1" style={{ width: '9%' }}>
            <motion.div
              animate={{
                height: `${(value / maxVal) * 140}px`,
                backgroundColor: getBarColor(index),
              }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full rounded-t-md"
              style={{ minHeight: '8px' }}
            />
            <span className="text-xs text-gray-500 font-mono">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-brand-500" />
          Default
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
          Comparing
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
          Sorted
        </span>
      </div>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-4 -right-4 rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-xs shadow-xl"
      >
        <div className="text-gray-400">Time Complexity</div>
        <div className="font-mono font-bold text-amber-400">O(n2)</div>
      </motion.div>
    </div>
  )
}

const CYCLING_WORDS = ['Visualize', 'Understand', 'Practice', 'Master']

function AnimatedWord() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % CYCLING_WORDS.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={index}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-block text-gradient"
      >
        {CYCLING_WORDS[index]}
      </motion.span>
    </AnimatePresence>
  )
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gray-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/5 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-screen flex-col items-center justify-center gap-16 py-24 lg:flex-row lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left lg:w-1/2"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-400"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
              Free for students and educators
            </motion.div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-50 sm:text-5xl lg:text-6xl">
              <AnimatedWord />
              <br />
              <span className="text-gray-100">Data Structures</span>
              <br />
              <span className="text-gray-100">and Algorithms</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-gray-400 leading-relaxed">
              Step-by-step algorithm visualizations, a multi-language coding
              playground, timed interview challenges, and a performance lab
              — all in one platform.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/visualizer"
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600 hover:-translate-y-0.5"
              >
                Start Visualizing
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="https://github.com/mayankchoudhary7251-bit/algovision"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800/50 px-6 py-3 text-sm font-semibold text-gray-300 transition-all hover:border-gray-600 hover:text-white hover:-translate-y-0.5"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              {[
                { value: '30+', label: 'Algorithms' },
                { value: '4', label: 'Languages' },
                { value: '100%', label: 'Free' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-gray-100">{value}</div>
                  <div className="text-sm text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="w-full lg:w-1/2 max-w-lg"
          >
            <SortingVisualizer />
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {['Bubble Sort', 'Merge Sort', 'Quick Sort', 'Heap Sort'].map((algo, i) => (
                <span
                  key={algo}
                  className={`rounded-full px-3 py-1 text-xs font-medium border ${
                    i === 0
                      ? 'bg-brand-500/20 text-brand-400 border-brand-500/30'
                      : 'bg-gray-800 text-gray-500 border-gray-700'
                  }`}
                >
                  {algo}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
