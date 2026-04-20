import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

const mockHook = vi.hoisted(() => vi.fn())

vi.mock('@/market/use-spot-price', () => ({
  useSpotPrice: (metal: string) => mockHook(metal),
}))

import { SpotPriceInline } from './SpotPriceInline'

beforeEach(() => {
  mockHook.mockReset()
})
afterEach(() => {
  mockHook.mockReset()
})

describe('SpotPriceInline', () => {
  it('renders a loading ellipsis when isLoading', () => {
    mockHook.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      stale: false,
    })
    render(<SpotPriceInline metal="gold" />)
    expect(screen.getByText('…')).toBeInTheDocument()
  })

  it('renders n/a when error', () => {
    mockHook.mockReturnValue({
      data: undefined,
      error: new Error('nope'),
      isLoading: false,
      stale: false,
    })
    render(<SpotPriceInline metal="gold" />)
    expect(screen.getByText('n/a')).toBeInTheDocument()
  })

  it('renders USD price with (cached) marker when stale', () => {
    mockHook.mockReturnValue({
      data: {
        metal: 'gold',
        pricePerOunceUsd: 1234,
        change24hPercent: 0,
        asOf: '2026-04-19T00:00:00Z',
        source: 'metalpriceapi',
        stale: true,
      },
      error: undefined,
      isLoading: false,
      stale: true,
    })
    render(<SpotPriceInline metal="gold" />)
    expect(screen.getByText('$1,234.00')).toBeInTheDocument()
    expect(screen.getByText('(cached)')).toBeInTheDocument()
  })
})
