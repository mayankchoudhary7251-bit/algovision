interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
}

export function ProgressRing({
  progress, size = 80, strokeWidth = 6, color = '#6366f1', label
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={radius}
            fill="none" stroke="#1f2937" strokeWidth={strokeWidth} />
          <circle cx={size/2} cy={size/2} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-100">{Math.round(progress)}%</span>
        </div>
      </div>
      {label && <span className="text-xs text-gray-400 text-center">{label}</span>}
    </div>
  )
}
