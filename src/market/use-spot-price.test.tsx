import type { ReactNode } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SpotPrice } from './schema'
import { useSpotPrice } from './use-spot-price'

const payload: SpotPrice = {
  metal: 'gold',
  pricePerOunceUsd: 2500,
  change24hPercent: 0.5,
  asOf: '2026-04-19T00:00:00.000Z',
  source: 'metalpriceapi',
  stale: false,
}

beforeEach(() => vi.restoreAllMocks())

function wrapper({ children }: { children: ReactNode }) {
  return (
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      {children}
    </SWRConfig>
  )
}

describe('useSpotPrice', () => {
  it('fetches, returns data, and exposes loading flag', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify(payload), { status: 200 })),
    )

    const { result } = renderHook(() => useSpotPrice('gold'), { wrapper })

    expect(result.current.isLoading).toBe(true)
    await waitFor(() =>
      expect(result.current.data?.pricePerOunceUsd).toBe(2500),
    )
    expect(result.current.isLoading).toBe(false)
    expect(result.current.stale).toBe(false)
  })

  it('surfaces stale=true when the server flags it', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ ...payload, stale: true }), {
            status: 200,
          }),
      ),
    )
    const { result } = renderHook(() => useSpotPrice('gold'), { wrapper })
    await waitFor(() => expect(result.current.data?.stale).toBe(true))
    expect(result.current.stale).toBe(true)
  })
})
