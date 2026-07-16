import type { VisualizerStep } from '../../types/visualizer.types'

/**
 * Quick Sort step generator.
 * Time: O(n log n) avg, O(n²) worst | Space: O(log n) | Stable: No
 *
 * How it works: pick a pivot, partition the array so elements
 * smaller than pivot are left, larger are right, then recurse.
 */
export function generateQuickSortSteps(input: number[]): VisualizerStep[] {
  const steps: VisualizerStep[] = []
  const arr = [...input]
  const sorted: number[] = []

  steps.push({ array: [...arr], comparing: null, swapped: null, sorted: [], pivot: null, message: 'Starting Quick Sort' })

  function partition(low: number, high: number): number {
    const pivotVal = arr[high]
    steps.push({ array: [...arr], comparing: null, swapped: null, sorted: [...sorted], pivot: high, message: `Pivot selected: ${pivotVal}` })

    let i = low - 1

    for (let j = low; j < high; j++) {
      steps.push({ array: [...arr], comparing: [j, high], swapped: null, sorted: [...sorted], pivot: high, message: `Comparing ${arr[j]} with pivot ${pivotVal}` })

      if (arr[j] <= pivotVal) {
        i++
        if (i !== j) {
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          steps.push({ array: [...arr], comparing: null, swapped: [i, j], sorted: [...sorted], pivot: high, message: `Swapped ${arr[j]} and ${arr[i]}` })
        }
      }
    }

    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    sorted.push(i + 1)
    steps.push({ array: [...arr], comparing: null, swapped: [i + 1, high], sorted: [...sorted], pivot: null, message: `Pivot ${pivotVal} placed at correct position ${i + 1}` })
    return i + 1
  }

  function quickSort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high)
      quickSort(low, pi - 1)
      quickSort(pi + 1, high)
    } else if (low === high) {
      sorted.push(low)
      steps.push({ array: [...arr], comparing: null, swapped: null, sorted: [...sorted], pivot: null, message: `Single element ${arr[low]} is in place` })
    }
  }

  quickSort(0, arr.length - 1)
  steps.push({ array: [...arr], comparing: null, swapped: null, sorted: Array.from({ length: arr.length }, (_, i) => i), pivot: null, message: 'Array is sorted!' })
  return steps
}
