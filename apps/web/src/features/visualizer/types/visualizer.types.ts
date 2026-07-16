/**
 * A single frame of an algorithm animation.
 * Every algorithm step generator produces an array of these.
 */
export interface VisualizerStep {
  /** The array state at this step */
  array: number[]
  /** Indices currently being compared (highlighted amber) */
  comparing: number[] | null
  /** Indices that were just swapped (highlighted pink briefly) */
  swapped: number[] | null
  /** Indices confirmed in their final sorted position (highlighted green) */
  sorted: number[]
  /** The pivot index in Quick Sort (highlighted orange) */
  pivot: number | null
  /** Human-readable description of what is happening at this step */
  message: string
}

/** Playback state for the animation player */
export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'finished'

/** Algorithm metadata displayed in the UI */
export interface AlgorithmInfo {
  id: string
  name: string
  category: 'sorting' | 'searching' | 'graph' | 'tree' | 'dp'
  timeComplexity: {
    best: string
    average: string
    worst: string
  }
  spaceComplexity: string
  stable: boolean
  description: string
}

/** Configuration for the visualizer */
export interface VisualizerConfig {
  arraySize: number
  minValue: number
  maxValue: number
  animationSpeed: number  // ms per step (lower = faster)
}

export const DEFAULT_CONFIG: VisualizerConfig = {
  arraySize: 20,
  minValue: 5,
  maxValue: 100,
  animationSpeed: 300,
}

/** Generate a random array within the config bounds */
export function generateRandomArray(config: VisualizerConfig): number[] {
  return Array.from({ length: config.arraySize }, () =>
    Math.floor(Math.random() * (config.maxValue - config.minValue + 1)) + config.minValue
  )
}