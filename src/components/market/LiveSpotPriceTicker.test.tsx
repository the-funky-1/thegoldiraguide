import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LiveSpotPriceTicker } from './LiveSpotPriceTicker'

vi.mock('@/market/use-spot-price', () => ({
  useSpotPrice: (metal: string) => ({
    data: {
      metal,
      pricePerOunceUsd: metal === 'gold' ? 2500 : 30,
      change24hPercent: 0.75,
      asOf: '2026-04-19T00:00:00Z',
      source: 'metalpriceapi',
      stale: false,
    },
    error: undefined,
    isLoading: false,
    stale: false,
  }),
}))

describe('LiveSpotPriceTicker', () => {
  it('renders a price per metal with aria-live polite', () => {
    render(<LiveSpotPriceTicker metals={['gold', 'silver']} />)
    const ticker = screen.getByRole('status')
    expect(ticker).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByText(/gold/i)).toBeInTheDocument()
    expect(screen.getByText('$2,500.00')).toBeInTheDocument()
    expect(screen.getByText(/silver/i)).toBeInTheDocument()
    expect(screen.getByText('$30.00')).toBeInTheDocument()
  })

  it('shows the 24h change with an up-arrow + percent', () => {
    render(<LiveSpotPriceTicker metals={['gold']} />)
    expect(screen.getByText(/▲ 0\.8%/)).toBeInTheDocument()
  })
})
