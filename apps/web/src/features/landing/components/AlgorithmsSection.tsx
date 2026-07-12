import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, MemoryStick, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const CATEGORIES = ['All', 'Sorting', 'Graphs', 'Trees', 'Dynamic Programming', 'Searching']

const ALGORITHMS = [
  { name: 'Bubble Sort',        category: 'Sorting',             time: 'O(n²)',      space: 'O(1)',    difficulty: 'Beginner' },
  { name: 'Merge Sort',         category: 'Sorting',             time: 'O(n log n)', space: 'O(n)',    difficulty: 'Intermediate' },
  { name: 'Quick Sort',         category: 'Sorting',             time: 'O(n log n)', space: 'O(log n)',difficulty: 'Intermediate' },
  { name: 'Heap Sort',          category: 'Sorting',             time: 'O(n log n)', space: 'O(1)',    difficulty: 'Intermediate' },
  { name: 'Insertion Sort',     category: 'Sorting',             time: 'O(n²)',      space: 'O(1)',    difficulty: 'Beginner' },
  { name: 'Selection Sort',     category: 'Sorting',             time: 'O(n²)',      space: 'O(1)',    difficulty: 'Beginner' },
  { name: 'BFS',                category: 'Graphs',              time: 'O(V + E)',   space: 'O(V)',    difficulty: 'Intermediate' },
  { name: 'DFS',                category: 'Graphs',              time: 'O(V + E)',   space: 'O(V)',    difficulty: 'Intermediate' },
  { name: 'Dijkstra',           category: 'Graphs',              time: 'O(V log V)', space: 'O(V)',    difficulty: 'Advanced' },
  { name: "A* Search",          category: 'Graphs',              time: 'O(E log V)', space: 'O(V)',    difficulty: 'Advanced' },
  { name: "Kruskal's",          category: 'Graphs',              time: 'O(E log E)', space: 'O(V)',    difficulty: 'Advanced' },
  { name: "Prim's",             category: 'Graphs',              time: 'O(E log V)', space: 'O(V)',    difficulty: 'Advanced' },
  { name: 'Binary Search Tree', category: 'Trees',               time: 'O(log n)',   space: 'O(n)',    difficulty: 'Beginner' },
  { name: 'AVL Tree',           category: 'Trees',               time: 'O(log n)',   space: 'O(n)',    difficulty: 'Advanced' },
  { name: 'Heap (Min/Max)',     category: 'Trees',               time: 'O(log n)',   space: 'O(n)',    difficulty: 'Intermediate' },
  { name: 'Trie',               category: 'Trees',               time: 'O(m)',       space: 'O(m*n)',  difficulty: 'Intermediate' },
  { name: 'Fibonacci (DP)',     category: 'Dynamic Programming', time: 'O(n)',       space: 'O(n)',    difficulty: 'Beginner' },
  { name: 'Knapsack',           category: 'Dynamic Programming', time: 'O(n*W)',     space: 'O(n*W)',  difficulty: 'Advanced' },
  { name: 'LCS',                category: 'Dynamic Programming', time: 'O(m*n)',     space: 'O(m*n)',  difficulty: 'Advanced' },
  { name: 'Binary Search',      category: 'Searching',           time: 'O(log n)',   space: 'O(1)',    difficulty: 'Beginner' },
]

const DIFFICULTY_COLORS = {
  Beginner:     'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Advanced:     'text-rose-400 bg-rose-500/10 border-rose-500/20',
}

export function AlgorithmsSection() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? ALGORITHMS
    : ALGORITHMS.filter((a) => a.category === activeCategory)

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
            Algorithm Library
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-50 sm:text-4xl">
            30+ algorithms,{' '}
            <span className="text-gradient">all visualized</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Filter by category and explore every algorithm with complexity analysis,
            pseudocode, and multi-language implementations.
          </p>
        </motion.div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200',
                activeCategory === cat
                  ? 'border-brand-500/50 bg-brand-500/10 text-brand-400'
                  : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-200'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((algo) => (
              <motion.div
                key={algo.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                whileHover={{ y: -2 }}
                className="group flex flex-col rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition-all hover:border-gray-700 hover:bg-gray-900"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-100">{algo.name}</h3>
                  <ChevronRight className="h-4 w-4 text-gray-600 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-400" />
                </div>

                <span className={cn(
                  'mt-2 inline-block w-fit rounded-full border px-2 py-0.5 text-xs font-medium',
                  DIFFICULTY_COLORS[algo.difficulty as keyof typeof DIFFICULTY_COLORS]
                )}>
                  {algo.difficulty}
                </span>

                <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {algo.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MemoryStick className="h-3 w-3" />
                    {algo.space}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-gray-500">
            Showing {filtered.length} of {ALGORITHMS.length} algorithms
          </p>
        </motion.div>
      </div>
    </section>
  )
}
