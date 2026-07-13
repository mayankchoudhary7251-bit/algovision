import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const STATS = [
  {
    value: 30,
    suffix: '+',
    label: 'Algorithms Visualized',
    description: 'Sorting, graphs, DP, trees and more',
  },
  {
    value: 4,
    suffix: '',
    label: 'Programming Languages',
    description: 'Java, C++, Python, JavaScript',
  },
  {
    value: 100,
    suffix: '%',
    label: 'Free to Use',
    description: 'No paywalls, no subscriptions',
  },
  {
    value: 12,
    suffix: '+',
    label: 'Data Structures',
    description: 'Arrays, trees, graphs, heaps and more',
  },
]

interface CountUpProps {
  target: number
  suffix: string
  duration?: number
}

function CountUp({ target, suffix, duration = 2000 }: CountUpProps) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let startTime: number
    const startValue = 0

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(startValue + (target - startValue) * eased))
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [isInView, target, duration])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section className="relative bg-gray-950 py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-gray-800 bg-gray-900/50 px-8 py-12 backdrop-blur-sm"
        >
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-extrabold tracking-tight text-gradient sm:text-5xl">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-2 text-base font-semibold text-gray-100">
                  {stat.label}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
