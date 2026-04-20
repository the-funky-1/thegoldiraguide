import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  _resetCacheForTests,
  getCachedSpot,
  getStaleSpot,
  setCachedSpot,
} from './cache'
import type { SpotPrice } from './schema'

const sample = (metal: 'gold' = 'gold'): SpotPrice => ({
  metal,
  pricePerOunceUsd: 2000,
  change24hPercent: 0.1,
  asOf: '2026-04-19T00:00:00.000Z',
  source: 'metalpriceapi',
  stale: false,
})

beforeEach(() => {
  _resetCacheForTests()
  vi.useFakeTimers({ shouldAdvanceTime: false })
})
afterEach(() => {
  vi.useRealTimers()
})

describe('in-process LRU', () => {
  it('returns null when the key is not cached', async () => {
    expect(await getCachedSpot('gold')).toBeNull()
  })
  it('returns the value until TTL expires', async () => {
    const p = sample()
    await setCachedSpot('gold', p)
    expect(await getCachedSpot('gold')).toEqual(p)
    vi.advanceTimersByTime(6_000)
    expect(await getCachedSpot('gold')).toBeNull()
  })
  it('keeps the stale copy indefinitely for fallback', async () => {
    const p = sample()
    await setCachedSpot('gold', p)
    vi.advanceTimersByTime(60_000)
    const stale = await getStaleSpot('gold')
    expect(stale?.pricePerOunceUsd).toBe(p.pricePerOunceUsd)
    expect(stale?.stale).toBe(true)
  })
})
