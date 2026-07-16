import { useState, useEffect, useCallback, useRef } from 'react'
import type { VisualizerStep, VisualizerConfig, PlaybackStatus } from '../types/visualizer.types'
import { generateRandomArray, DEFAULT_CONFIG } from '../types/visualizer.types'
import { generateBubbleSortSteps } from '../algorithms/sorting/bubbleSort'
import { generateSelectionSortSteps } from '../algorithms/sorting/selectionSort'
import { generateInsertionSortSteps } from '../algorithms/sorting/insertionSort'
import { generateMergeSortSteps } from '../algorithms/sorting/mergeSort'
import { generateQuickSortSteps } from '../algorithms/sorting/quickSort'
import { generateHeapSortSteps } from '../algorithms/sorting/heapSort'

export const SORTING_ALGORITHMS = {
  'bubble-sort':    { name: 'Bubble Sort',    generate: generateBubbleSortSteps },
  'selection-sort': { name: 'Selection Sort', generate: generateSelectionSortSteps },
  'insertion-sort': { name: 'Insertion Sort', generate: generateInsertionSortSteps },
  'merge-sort':     { name: 'Merge Sort',     generate: generateMergeSortSteps },
  'quick-sort':     { name: 'Quick Sort',     generate: generateQuickSortSteps },
  'heap-sort':      { name: 'Heap Sort',      generate: generateHeapSortSteps },
} as const

export type SortingAlgorithmId = keyof typeof SORTING_ALGORITHMS

export function useVisualizer(algorithmId: SortingAlgorithmId) {
  const [config, setConfig] = useState<VisualizerConfig>(DEFAULT_CONFIG)
  const [inputArray, setInputArray] = useState<number[]>(() => generateRandomArray(DEFAULT_CONFIG))
  const [steps, setSteps] = useState<VisualizerStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [status, setStatus] = useState<PlaybackStatus>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const generateSteps = useCallback((arr: number[]) => {
    const algo = SORTING_ALGORITHMS[algorithmId]
    const generated = algo.generate(arr)
    setSteps(generated)
    setCurrentStep(0)
    setStatus('idle')
  }, [algorithmId])

  useEffect(() => { generateSteps(inputArray) }, [algorithmId, inputArray, generateSteps])

  useEffect(() => {
    if (status !== 'playing') return
    if (currentStep >= steps.length - 1) { setStatus('finished'); return }
    timerRef.current = setTimeout(() => setCurrentStep(s => s + 1), config.animationSpeed)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [status, currentStep, steps.length, config.animationSpeed])

  const play = () => { if (status === 'finished') { setCurrentStep(0); setStatus('playing') } else setStatus('playing') }
  const pause = () => setStatus('paused')
  const stepForward = () => { if (currentStep < steps.length - 1) { setStatus('paused'); setCurrentStep(s => s + 1) } }
  const stepBackward = () => { if (currentStep > 0) { setStatus('paused'); setCurrentStep(s => s - 1) } }
  const restart = () => { setCurrentStep(0); setStatus('idle') }

  const randomize = () => {
    const arr = generateRandomArray(config)
    setInputArray(arr)
  }

  const setSpeed = (speed: number) => setConfig(c => ({ ...c, animationSpeed: speed }))
  const setArraySize = (size: number) => {
    const newConfig = { ...config, arraySize: size }
    setConfig(newConfig)
    const arr = generateRandomArray(newConfig)
    setInputArray(arr)
  }

  return {
    steps, currentStep, status, config, inputArray,
    play, pause, stepForward, stepBackward, restart, randomize, setSpeed, setArraySize,
    totalSteps: steps.length,
    currentStepData: steps[currentStep] ?? null,
    progress: steps.length > 0 ? (currentStep / (steps.length - 1)) * 100 : 0,
  }
}
