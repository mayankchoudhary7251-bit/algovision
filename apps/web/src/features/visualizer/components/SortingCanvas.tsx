import { motion } from 'framer-motion'
import type { VisualizerStep } from '../types/visualizer.types'
import { cn } from '@/shared/lib/utils'

interface SortingCanvasProps {
  step: VisualizerStep | null
  animationSpeed: number
}

function getBarColor(index: number, step: VisualizerStep): string {
  if (step.sorted.includes(index)) return '#10b981'
  if (step.pivot === index) return '#f97316'
  if (step.swapped?.includes(index)) return '#ec4899'
  if (step.comparing?.includes(index)) return '#f59e0b'
  return '#6366f1'
}

export function SortingCanvas({ step, animationSpeed }: SortingCanvasProps) {
  if (!step) return (
    <div className="flex h-64 items-center justify-center text-gray-500">
      Press play to start the visualization
    </div>
  )

  const maxVal = Math.max(...step.array)
  const transitionDuration = Math.min(animationSpeed / 1000, 0.3)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-center gap-1 h-56 px-2">
        {step.array.map((value, index) => (
          <div key={index} className="flex flex-col items-center gap-1 flex-1 min-w-0">
            <motion.div
              animate={{
                height: `${(value / maxVal) * 200}px`,
                backgroundColor: getBarColor(index, step),
              }}
              transition={{ duration: transitionDuration, ease: 'easeInOut' }}
              className="w-full rounded-t-sm"
              style={{ minHeight: '4px' }}
            />
            {step.array.length <= 20 && (
              <span className="text-xs text-gray-500 font-mono leading-none">{value}</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-brand-500" /> Default
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-400" /> Comparing
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-pink-400" /> Swapped
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-orange-400" /> Pivot
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-400" /> Sorted
        </span>
      </div>

      <div className={cn(
        'text-center text-sm font-medium px-4 py-2 rounded-lg',
        step.sorted.length === step.array.length
          ? 'text-emerald-400 bg-emerald-500/10'
          : 'text-gray-300 bg-gray-800/50'
      )}>
        {step.message}
      </div>
    </div>
  )
}
