import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const FAQS = [
  {
    question: 'Is AlgoVision completely free?',
    answer:
      'Yes, AlgoVision is 100% free for students, educators, and anyone learning DSA. There are no paywalls, no premium tiers, and no credit card required. Just sign up and start learning.',
  },
  {
    question: 'Which programming languages are supported?',
    answer:
      'AlgoVision supports Java, C++, Python, and JavaScript. Every algorithm includes a complete implementation in all four languages. The coding playground also supports execution in all four languages with instant feedback.',
  },
  {
    question: 'How does the Algorithm Performance Lab work?',
    answer:
      'The Performance Lab lets you select multiple algorithms and an input size range, then runs them simultaneously and plots the results. You can compare execution time, number of comparisons, and memory usage as input size grows — making theoretical complexity analysis tangible.',
  },
  {
    question: 'What makes AlgoVision different from other DSA platforms?',
    answer:
      'Most platforms focus on either visualization or practice problems — AlgoVision combines both, plus adds the Algorithm Performance Lab for empirical benchmarking. The step-by-step visualization with play/pause/rewind controls, side-by-side algorithm comparison, and multi-language support make it a complete learning environment.',
  },
  {
    question: 'Can I use AlgoVision for interview preparation?',
    answer:
      'Absolutely. The Interview Mode simulates timed coding challenges with difficulty levels from Beginner to Advanced. The Quiz Engine tests conceptual knowledge, and the Coding Playground lets you practice writing actual solutions. Combined with the visualizations, it covers both the conceptual and practical sides of technical interviews.',
  },
  {
    question: 'Which data structures and algorithms are covered?',
    answer:
      'AlgoVision covers Arrays, Linked Lists, Stacks, Queues, Trees, AVL Trees, Heaps, Tries, Graphs, Segment Trees, Fenwick Trees, and Union-Find. Algorithm coverage includes all major sorting and searching algorithms, graph algorithms (BFS, DFS, Dijkstra, A*, Kruskal, Prim), Dynamic Programming, Greedy Algorithms, Backtracking, and String Matching — over 30 total.',
  },
  {
    question: 'Is AlgoVision mobile-friendly?',
    answer:
      'Yes, AlgoVision is fully responsive and works on phones and tablets. The visualization canvas scales to the screen size, and the navigation collapses to a mobile-friendly menu on smaller screens.',
  },
]

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
  index: number
}

function FAQItem({ question, answer, isOpen, onClick, index }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        'rounded-xl border transition-all duration-200',
        isOpen
          ? 'border-brand-500/30 bg-brand-500/5'
          : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
      )}
    >
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className={cn(
          'text-base font-medium transition-colors',
          isOpen ? 'text-brand-400' : 'text-gray-100'
        )}>
          {question}
        </span>
        <span className={cn(
          'flex-shrink-0 rounded-full p-1 transition-all duration-200',
          isOpen ? 'bg-brand-500/20 text-brand-400' : 'bg-gray-800 text-gray-400'
        )}>
          {isOpen ? (
            <Minus className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm leading-relaxed text-gray-400">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  function handleClick(index: number) {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative bg-gray-950 py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-400">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-50 sm:text-4xl">
            Frequently asked{' '}
            <span className="text-gradient">questions</span>
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Everything you need to know about AlgoVision.
          </p>
        </motion.div>

        <div className="mt-12 space-y-3">
          {FAQS.map((faq, index) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
