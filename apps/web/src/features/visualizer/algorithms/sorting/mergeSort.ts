import type { VisualizerStep } from '../../types/visualizer.types'

/**
 * Merge Sort step generator.
 * Time: O(n log n) | Space: O(n) | Stable: Yes
 *
 * How it works: divide the array in half recursively until
 * single elements, then merge sorted halves back together.
 */
export function generateMergeSortSteps(input: number[]): VisualizerStep[] {
  const steps: VisualizerStep[] = []
  const arr = [...input]
  const sorted: number[] = []

  steps.push({ array: [...arr], comparing: null, swapped: null, sorted: [], pivot: null, message: 'Starting Merge Sort' })

  function merge(left: number, mid: number, right: number) {
    const leftArr = arr.slice(left, mid + 1)
    const rightArr = arr.slice(mid + 1, right + 1)
    let i = 0, j = 0, k = left

    steps.push({ array: [...arr], comparing: [left, right], swapped: null, sorted: [...sorted], pivot: null, message: `Merging subarrays [${left}...${mid}] and [${mid + 1}...${right}]` })

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({ array: [...arr], comparing: [left + i, mid + 1 + j], swapped: null, sorted: [...sorted], pivot: null, message: `Comparing ${leftArr[i]} and ${rightArr[j]}` })

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i]
        i++
      } else {
        arr[k] = rightArr[j]
        j++
      }
      steps.push({ array: [...arr], comparing: null, swapped: [k], sorted: [...sorted], pivot: null, message: `Placed ${arr[k]} at position ${k}` })
      k++
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i]
      steps.push({ array: [...arr], comparing: null, swapped: [k], sorted: [...sorted], pivot: null, message: `Placed remaining ${arr[k]}` })
      i++; k++
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j]
      steps.push({ array: [...arr], comparing: null, swapped: [k], sorted: [...sorted], pivot: null, message: `Placed remaining ${arr[k]}` })
      j++; k++
    }

    for (let x = left; x <= right; x++) sorted.push(x)
  }

  function mergeSortHelper(left: number, right: number) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2)
      steps.push({ array: [...arr], comparing: null, swapped: null, sorted: [...sorted], pivot: null, message: `Dividing array at index ${mid}` })
      mergeSortHelper(left, mid)
      mergeSortHelper(mid + 1, right)
      merge(left, mid, right)
    }
  }

  mergeSortHelper(0, arr.length - 1)
  steps.push({ array: [...arr], comparing: null, swapped: null, sorted: Array.from({ length: arr.length }, (_, i) => i), pivot: null, message: 'Array is sorted!' })
  return steps
}
