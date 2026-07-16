import type { VisualizerStep } from '../../types/visualizer.types'

/**
 * Heap Sort step generator.
 * Time: O(n log n) | Space: O(1) | Stable: No
 *
 * How it works: build a max-heap, then repeatedly extract
 * the maximum element to the end of the array.
 */
export function generateHeapSortSteps(input: number[]): VisualizerStep[] {
  const steps: VisualizerStep[] = []
  const arr = [...input]
  const n = arr.length
  const sorted: number[] = []

  steps.push({ array: [...arr], comparing: null, swapped: null, sorted: [], pivot: null, message: 'Starting Heap Sort — building max heap' })

  function heapify(size: number, root: number) {
    let largest = root
    const left = 2 * root + 1
    const right = 2 * root + 2

    if (left < size) {
      steps.push({ array: [...arr], comparing: [largest, left], swapped: null, sorted: [...sorted], pivot: null, message: `Comparing ${arr[largest]} with left child ${arr[left]}` })
      if (arr[left] > arr[largest]) largest = left
    }

    if (right < size) {
      steps.push({ array: [...arr], comparing: [largest, right], swapped: null, sorted: [...sorted], pivot: null, message: `Comparing ${arr[largest]} with right child ${arr[right]}` })
      if (arr[right] > arr[largest]) largest = right
    }

    if (largest !== root) {
      ;[arr[root], arr[largest]] = [arr[largest], arr[root]]
      steps.push({ array: [...arr], comparing: null, swapped: [root, largest], sorted: [...sorted], pivot: null, message: `Swapped ${arr[largest]} and ${arr[root]}` })
      heapify(size, largest)
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i)
  steps.push({ array: [...arr], comparing: null, swapped: null, sorted: [...sorted], pivot: null, message: 'Max heap built' })

  for (let i = n - 1; i > 0; i--) {
    ;[arr[0], arr[i]] = [arr[i], arr[0]]
    sorted.push(i)
    steps.push({ array: [...arr], comparing: null, swapped: [0, i], sorted: [...sorted], pivot: null, message: `Moved max ${arr[i]} to position ${i}` })
    heapify(i, 0)
  }

  sorted.push(0)
  steps.push({ array: [...arr], comparing: null, swapped: null, sorted: [...sorted], pivot: null, message: 'Array is sorted!' })
  return steps
}
