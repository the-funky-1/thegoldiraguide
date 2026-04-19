import { describe, expect, it } from 'vitest'
import { ROI_DEFAULTS } from '@/finance/roi/schema'
import { useRoiStore } from './store'

describe('useRoiStore', () => {
  it('starts with defaults', () => {
    useRoiStore.getState().reset()
    expect(useRoiStore.getState().input).toEqual(ROI_DEFAULTS)
  })
  it('setInput merges patch', () => {
    useRoiStore.getState().setInput({ horizonYears: 30 })
    expect(useRoiStore.getState().input.horizonYears).toBe(30)
    useRoiStore.getState().reset()
  })
  it('reset restores defaults', () => {
    useRoiStore.getState().setInput({ horizonYears: 1 })
    useRoiStore.getState().reset()
    expect(useRoiStore.getState().input.horizonYears).toBe(
      ROI_DEFAULTS.horizonYears,
    )
  })
})
