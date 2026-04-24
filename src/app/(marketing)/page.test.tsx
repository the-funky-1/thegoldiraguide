import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import HomePage from './page'

vi.mock('@/market/use-spot-price', () => ({
  useSpotPrice: (metal: string) => ({
    data: { metal, pricePerOunceUsd: '2402.15', change24hPercent: 0.6 },
    error: null,
    isLoading: false,
    stale: false,
  }),
}))

describe('HomePage', () => {
  it('renders the site title as the h1', () => {
    render(<HomePage />)
    expect(
      screen.getByRole('heading', { level: 1, name: /the gold ira guide/i }),
    ).toBeInTheDocument()
  })

  it('renders a reader-focused subtitle (no dealer-voice phrasing)', () => {
    render(<HomePage />)
    const subtitle = screen.getByTestId('home-subtitle')
    expect(subtitle.textContent).toMatch(
      /independent reference on self-directed precious metals IRAs/i,
    )
    expect(subtitle.textContent ?? '').not.toMatch(/owned and operated by/i)
    expect(subtitle.textContent ?? '').not.toMatch(/binding written estimate/i)
  })

  it('renders the OwnershipLockup in the hero', () => {
    render(<HomePage />)
    expect(screen.getByTestId('ownership-lockup')).toBeInTheDocument()
  })

  it('renders the SignalStrip with article and tool counts', () => {
    render(<HomePage />)
    expect(screen.getByLabelText(/site signals/i)).toBeInTheDocument()
    expect(screen.getByText(/articles/i)).toBeInTheDocument()
    expect(screen.getByText(/calculators/i)).toBeInTheDocument()
  })

  it('renders the MarketPulseCard', () => {
    render(<HomePage />)
    expect(
      screen.getByRole('complementary', { name: /market pulse/i }),
    ).toBeInTheDocument()
  })

  it('renders the pillars region with a featured pillar card', () => {
    render(<HomePage />)
    expect(screen.getByRole('region', { name: /pillars/i })).toBeInTheDocument()
    expect(screen.getByTestId('featured-eyebrow')).toBeInTheDocument()
  })
})
