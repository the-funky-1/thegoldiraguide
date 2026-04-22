import { describe, expect, it } from 'vitest'
import {
  SAMPLE_RETURN_SETS,
  correlationMatrix,
  getReturnSet,
  pearsonCorrelation,
} from './compute'

describe('pearsonCorrelation', () => {
  it('returns 1 for identical movement and -1 for opposite movement', () => {
    expect(pearsonCorrelation([1, 2, 3], [1, 2, 3])).toBeCloseTo(1)
    expect(pearsonCorrelation([1, 2, 3], [3, 2, 1])).toBeCloseTo(-1)
  })

  it('returns 0 when one series is flat', () => {
    expect(pearsonCorrelation([1, 1, 1], [1, 2, 3])).toBe(0)
  })
})

describe('correlationMatrix', () => {
  it('creates one cell for every row/column asset pair', () => {
    const set = SAMPLE_RETURN_SETS[0]!
    const matrix = correlationMatrix(set)

    expect(matrix).toHaveLength(set.series.length * set.series.length)
    expect(matrix.filter((cell) => cell.rowId === cell.columnId)).toHaveLength(
      set.series.length,
    )
  })
})

describe('getReturnSet', () => {
  it('falls back to the first sample for unknown values', () => {
    expect(getReturnSet('nope' as never).id).toBe(SAMPLE_RETURN_SETS[0]!.id)
  })
})
