import type { VisualizerStep } from '../../types/visualizer.types'

/**
 * Bubble Sort step generator.
 * Time: O(n²) | Space: O(1) | Stable: Yes
 *
 * How it works: repeatedly compare adjacent elements and swap
 * if they are in the wrong order. After each pass, the largest
 * unsorted element "bubbles up" to its correct position.
 */
export function generateBubbleSortSteps(input: number[]): VisualizerStep[] {
  const steps: VisualizerStep[] = []
  const arr = [...input]
  const n = arr.length
  const sorted: number[] = []

  steps.push({ array: [...arr], comparing: null, swapped: null, sorted: [], pivot: null, message: 'Starting Bubble Sort' })

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ array: [...arr], comparing: [j, j + 1], swapped: null, sorted: [...sorted], pivot: null, message: `Comparing ${arr[j]} and ${arr[j + 1]}` })

      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        steps.push({ array: [...arr], comparing: null, swapped: [j, j + 1], sorted: [...sorted], pivot: null, message: `Swapped ${arr[j + 1]} and ${arr[j]}` })
      }
    }
    sorted.unshift(n - 1 - i)
    steps.push({ array: [...arr], comparing: null, swapped: null, sorted: [...sorted], pivot: null, message: `${arr[n - 1 - i]} is in its correct position` })
  }
  sorted.unshift(0)
  steps.push({ array: [...arr], comparing: null, swapped: null, sorted: [...sorted], pivot: null, message: 'Array is sorted!' })
  return steps
}
