import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DelayedProgress } from './DelayedProgress'

describe('DelayedProgress', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('reveals the child only after the specified delay', () => {
    render(
      <DelayedProgress delayMs={2000} placeholder="Calculating…">
        <div>Result ready</div>
      </DelayedProgress>,
    )
    expect(screen.getByText(/calculating/i)).toBeInTheDocument()
    expect(screen.queryByText('Result ready')).toBeNull()

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(screen.getByText('Result ready')).toBeInTheDocument()
    expect(screen.queryByText(/calculating/i)).toBeNull()
  })
})
