import { describe, expect, it } from 'vitest'
import { FEE_DRAG_DEFAULTS } from '@/finance/fee-drag/schema'
import { useFeeDragStore } from './store'

describe('useFeeDragStore', () => {
  it('starts with defaults', () => {
    useFeeDragStore.getState().reset()
    expect(useFeeDragStore.getState().input).toEqual(FEE_DRAG_DEFAULTS)
  })
  it('setInput merges patch', () => {
    useFeeDragStore.getState().setInput({ horizonYears: 30 })
    expect(useFeeDragStore.getState().input.horizonYears).toBe(30)
    useFeeDragStore.getState().reset()
  })
  it('reset restores defaults', () => {
    useFeeDragStore.getState().setInput({ horizonYears: 1 })
    useFeeDragStore.getState().reset()
    expect(useFeeDragStore.getState().input.horizonYears).toBe(
      FEE_DRAG_DEFAULTS.horizonYears,
    )
  })
})
