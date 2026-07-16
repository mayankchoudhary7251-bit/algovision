import { Play, Pause, SkipBack, SkipForward, RotateCcw, Shuffle } from 'lucide-react'
import type { PlaybackStatus } from '../types/visualizer.types'
import { cn } from '@/shared/lib/utils'

interface PlaybackControlsProps {
  status: PlaybackStatus
  currentStep: number
  totalSteps: number
  progress: number
  speed: number
  arraySize: number
  onPlay: () => void
  onPause: () => void
  onStepForward: () => void
  onStepBackward: () => void
  onRestart: () => void
  onRandomize: () => void
  onSpeedChange: (speed: number) => void
  onSizeChange: (size: number) => void
}

const SPEED_OPTIONS = [
  { label: '0.25x', value: 1200 },
  { label: '0.5x',  value: 600 },
  { label: '1x',    value: 300 },
  { label: '2x',    value: 150 },
  { label: '4x',    value: 75 },
]

export function PlaybackControls({
  status, currentStep, totalSteps, progress, speed, arraySize,
  onPlay, onPause, onStepForward, onStepBackward, onRestart, onRandomize,
  onSpeedChange, onSizeChange,
}: PlaybackControlsProps) {
  const isPlaying = status === 'playing'
  const isFinished = status === 'finished'

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <div className="mb-1 flex justify-between text-xs text-gray-500">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button onClick={onRandomize} title="Randomize array"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-all">
          <Shuffle className="h-4 w-4" />
        </button>
        <button onClick={onRestart} title="Restart"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-all">
          <RotateCcw className="h-4 w-4" />
        </button>
        <button onClick={onStepBackward} disabled={currentStep === 0} title="Step back"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
          <SkipBack className="h-4 w-4" />
        </button>
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600 transition-all"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-0.5" />}
        </button>
        <button onClick={onStepForward} disabled={isFinished} title="Step forward"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
          <SkipForward className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-1 ml-2">
          {SPEED_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => onSpeedChange(opt.value)}
              className={cn(
                'px-2 py-1 rounded text-xs font-medium transition-all',
                speed === opt.value
                  ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
              )}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 whitespace-nowrap">Array size: {arraySize}</span>
        <input type="range" min={5} max={50} value={arraySize}
          onChange={e => onSizeChange(Number(e.target.value))}
          className="flex-1 h-1 accent-brand-500 cursor-pointer"
        />
      </div>
    </div>
  )
}
