import type { VisualizerStep } from '../../types/visualizer.types'

/**
 * Insertion Sort step generator.
 * Time: O(n²) worst, O(n) best | Space: O(1) | Stable: Yes
 *
 * How it works: build the sorted portion one element at a time
 * by inserting each new element into its correct position.
 */
export function generateInsertionSortSteps(input: number[]): VisualizerStep[] {
  const steps: VisualizerStep[] = []
  const arr = [...input]
  const n = arr.length
  const sorted: number[] = [0]

  steps.push({ array: [...arr], comparing: null, swapped: null, sorted: [0], pivot: null, message: 'Starting Insertion Sort — first element is trivially sorted' })

  for (let i = 1; i < n; i++) {
    const key = arr[i]
    let j = i - 1

    steps.push({ array: [...arr], comparing: [i], swapped: null, sorted: [...sorted], pivot: null, message: `Inserting ${key} into the sorted portion` })

    while (j >= 0 && arr[j] > key) {
      steps.push({ array: [...arr], comparing: [j, j + 1], swapped: null, sorted: [...sorted], pivot: null, message: `${arr[j]} > ${key}, shifting ${arr[j]} right` })
      arr[j + 1] = arr[j]
      steps.push({ array: [...arr], comparing: null, swapped: [j, j + 1], sorted: [...sorted], pivot: null, message: `Shifted ${arr[j + 1]} to position ${j + 1}` })
      j--
    }

    arr[j + 1] = key
    sorted.push(i)
    steps.push({ array: [...arr], comparing: null, swapped: null, sorted: [...sorted], pivot: null, message: `Inserted ${key} at position ${j + 1}` })
  }

  steps.push({ array: [...arr], comparing: null, swapped: null, sorted: Array.from({ length: n }, (_, i) => i), pivot: null, message: 'Array is sorted!' })
  return steps
}
