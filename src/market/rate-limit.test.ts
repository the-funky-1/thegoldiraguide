import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { _resetLimiterForTests, checkInProcessLimit } from './rate-limit'

beforeEach(() => {
  _resetLimiterForTests()
  vi.useFakeTimers()
})
afterEach(() => vi.useRealTimers())

describe('checkInProcessLimit', () => {
  it('allows up to N requests within the window', () => {
    for (let i = 0; i < 30; i++) {
      expect(checkInProcessLimit('1.2.3.4')).toEqual({ ok: true, retryInMs: 0 })
    }
  })
  it('rejects the 31st request in the same minute', () => {
    for (let i = 0; i < 30; i++) checkInProcessLimit('1.2.3.4')
    const res = checkInProcessLimit('1.2.3.4')
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.retryInMs).toBeGreaterThan(0)
  })
  it('isolates by caller key', () => {
    for (let i = 0; i < 30; i++) checkInProcessLimit('1.1.1.1')
    expect(checkInProcessLimit('2.2.2.2').ok).toBe(true)
  })
  it('frees a slot after the window slides past it', () => {
    for (let i = 0; i < 30; i++) checkInProcessLimit('1.2.3.4')
    vi.advanceTimersByTime(61_000)
    expect(checkInProcessLimit('1.2.3.4').ok).toBe(true)
  })
})
