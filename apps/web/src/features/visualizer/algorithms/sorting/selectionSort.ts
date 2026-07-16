import type { VisualizerStep } from '../../types/visualizer.types'

/**
 * Selection Sort step generator.
 * Time: O(n²) | Space: O(1) | Stable: No
 *
 * How it works: find the minimum element in the unsorted portion
 * and swap it with the first unsorted element.
 */
export function generateSelectionSortSteps(input: number[]): VisualizerStep[] {
  const steps: VisualizerStep[] = []
  const arr = [...input]
  const n = arr.length
  const sorted: number[] = []

  steps.push({ array: [...arr], comparing: null, swapped: null, sorted: [], pivot: null, message: 'Starting Selection Sort' })

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    steps.push({ array: [...arr], comparing: [minIdx], swapped: null, sorted: [...sorted], pivot: null, message: `Finding minimum in range [${i}, ${n - 1}]` })

    for (let j = i + 1; j < n; j++) {
      steps.push({ array: [...arr], comparing: [minIdx, j], swapped: null, sorted: [...sorted], pivot: null, message: `Comparing ${arr[j]} with current minimum ${arr[minIdx]}` })
      if (arr[j] < arr[minIdx]) {
        minIdx = j
        steps.push({ array: [...arr], comparing: [minIdx], swapped: null, sorted: [...sorted], pivot: null, message: `New minimum found: ${arr[minIdx]}` })
      }
    }

    if (minIdx !== i) {
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
      steps.push({ array: [...arr], comparing: null, swapped: [i, minIdx], sorted: [...sorted], pivot: null, message: `Swapped ${arr[minIdx]} and ${arr[i]}` })
    }

    sorted.push(i)
    steps.push({ array: [...arr], comparing: null, swapped: null, sorted: [...sorted], pivot: null, message: `${arr[i]} placed in correct position` })
  }

  sorted.push(n - 1)
  steps.push({ array: [...arr], comparing: null, swapped: null, sorted: [...sorted], pivot: null, message: 'Array is sorted!' })
  return steps
}
