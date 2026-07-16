import { useState } from 'react'
import { motion } from 'framer-motion'
import { SortingCanvas } from '../components/SortingCanvas'
import { PlaybackControls } from '../components/PlaybackControls'
import { useVisualizer, SORTING_ALGORITHMS, type SortingAlgorithmId } from '../hooks/useVisualizer'
import { cn } from '@/shared/lib/utils'

const ALGORITHM_INFO = {
  'bubble-sort':    { time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)', stable: true },
  'selection-sort': { time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)', stable: false },
  'insertion-sort': { time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)', stable: true },
  'merge-sort':     { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' }, space: 'O(n)', stable: true },
  'quick-sort':     { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' }, space: 'O(log n)', stable: false },
  'heap-sort':      { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' }, space: 'O(1)', stable: false },
}

export function VisualizerPage() {
  const [selectedAlgo, setSelectedAlgo] = useState<SortingAlgorithmId>('bubble-sort')

  const {
    currentStepData, status, config, progress,
    currentStep, totalSteps,
    play, pause, stepForward, stepBackward, restart, randomize, setSpeed, setArraySize,
  } = useVisualizer(selectedAlgo)

  const info = ALGORITHM_INFO[selectedAlgo]

  return (
    <div className="min-h-screen bg-gray-950 pt-6 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Algorithm Visualizer</h1>
          <p className="mt-1 text-gray-400">Watch sorting algorithms execute step by step</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.keys(SORTING_ALGORITHMS) as SortingAlgorithmId[]).map((id) => (
            <button
              key={id}
              onClick={() => setSelectedAlgo(id)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-all',
                selectedAlgo === id
                  ? 'border-brand-500/50 bg-brand-500/10 text-brand-400'
                  : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:text-gray-200 hover:border-gray-600'
              )}
            >
              {SORTING_ALGORITHMS[id].name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
              <SortingCanvas step={currentStepData} animationSpeed={config.animationSpeed} />
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-4">
              <PlaybackControls
                status={status}
                currentStep={currentStep}
                totalSteps={totalSteps}
                progress={progress}
                speed={config.animationSpeed}
                arraySize={config.arraySize}
                onPlay={play}
                onPause={pause}
                onStepForward={stepForward}
                onStepBackward={stepBackward}
                onRestart={restart}
                onRandomize={randomize}
                onSpeedChange={setSpeed}
                onSizeChange={setArraySize}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
              <h2 className="text-base font-semibold text-gray-100 mb-4">
                {SORTING_ALGORITHMS[selectedAlgo].name}
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Time Complexity</div>
                  <div className="space-y-1.5">
                    {(['best', 'average', 'worst'] as const).map((c) => (
                      <div key={c} className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 capitalize">{c}</span>
                        <span className={cn(
                          'text-xs font-mono font-medium px-2 py-0.5 rounded',
                          c === 'best' ? 'text-emerald-400 bg-emerald-500/10' :
                          c === 'average' ? 'text-amber-400 bg-amber-500/10' :
                          'text-red-400 bg-red-500/10'
                        )}>
                          {info.time[c]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-gray-800 pt-3">
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Space Complexity</div>
                  <span className="text-xs font-mono font-medium text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                    {info.space}
                  </span>
                </div>
                <div className="border-t border-gray-800 pt-3">
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Stable</div>
                  <span className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded',
                    info.stable ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                  )}>
                    {info.stable ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
              <h3 className="text-sm font-semibold text-gray-100 mb-3">Progress</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">{Math.round(progress)}%</div>
                <div className="text-xs text-gray-500 mt-1">Step {currentStep + 1} of {totalSteps}</div>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-gray-800">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
