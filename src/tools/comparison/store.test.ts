import { describe, expect, it } from 'vitest'
import { useComparisonStore } from './store'

describe('useComparisonStore', () => {
  it('starts with asc + purchase-spread default', () => {
    useComparisonStore.getState().reset()
    expect(useComparisonStore.getState().filters.sortBy).toBe(
      'typicalPurchaseSpreadPercent',
    )
    expect(useComparisonStore.getState().filters.sortDir).toBe('asc')
  })
  it('setFilters merges patch', () => {
    useComparisonStore.getState().setFilters({ sortDir: 'desc' })
    expect(useComparisonStore.getState().filters.sortDir).toBe('desc')
    useComparisonStore.getState().reset()
  })
  it('reset restores defaults', () => {
    useComparisonStore.getState().setFilters({ storageModel: 'flat' })
    useComparisonStore.getState().reset()
    expect(useComparisonStore.getState().filters.storageModel).toBe('any')
  })
})
