import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MarketPulseCard } from './MarketPulseCard'

vi.mock('@/market/use-spot-price', () => ({
  useSpotPrice: (metal: string) => ({
    data: {
      metal,
      pricePerOunceUsd: '2402.15',
      change24hPercent: 0.6,
    },
    error: null,
    isLoading: false,
    stale: false,
  }),
}))

describe('MarketPulseCard', () => {
  it('renders the uppercase eyebrow and card heading', () => {
    render(<MarketPulseCard />)
    expect(screen.getByText(/market pulse/i)).toBeInTheDocument()
  })

  it('renders gold, silver, and platinum rows', () => {
    render(<MarketPulseCard />)
    expect(screen.getByText(/gold/i)).toBeInTheDocument()
    expect(screen.getByText(/silver/i)).toBeInTheDocument()
    expect(screen.getByText(/platinum/i)).toBeInTheDocument()
  })

  it('renders prices in a monospace class', () => {
    const { container } = render(<MarketPulseCard />)
    const monoNodes = container.querySelectorAll('[class*="font-mono"]')
    expect(monoNodes.length).toBeGreaterThanOrEqual(3)
  })

  it('links to the full live-spot-prices dashboard', () => {
    render(<MarketPulseCard />)
    const link = screen.getByRole('link', { name: /see full dashboard/i })
    expect(link).toHaveAttribute('href', '/tools/live-spot-prices')
  })
})
