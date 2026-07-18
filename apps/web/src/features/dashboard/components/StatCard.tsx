import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  subtitle?: string
  color: string
  delay?: number
}

export function StatCard({ label, value, subtitle, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5"
    >
      <div className="text-sm text-gray-400">{label}</div>
      <div className={cn('text-3xl font-bold mt-1', color)}>{value}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </motion.div>
  )
}
