import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HomeHero } from './HomeHero'

vi.mock('@/market/use-spot-price', () => ({
  useSpotPrice: (metal: string) => ({
    data: { metal, pricePerOunceUsd: 2402.15, change24hPercent: 0.6 },
    error: null,
    isLoading: false,
    stale: false,
  }),
}))

describe('HomeHero', () => {
  it('renders the site h1', () => {
    render(<HomeHero />)
    expect(
      screen.getByRole('heading', { level: 1, name: /the gold ira guide/i }),
    ).toBeInTheDocument()
  })

  it('renders the uppercase "Independent reference" eyebrow', () => {
    render(<HomeHero />)
    const eyebrow = screen.getByTestId('hero-eyebrow')
    expect(eyebrow.textContent).toMatch(/independent reference/i)
    expect(eyebrow.className).toMatch(/uppercase/)
  })

  it('renders the reader-focused subtitle from Plan 11', () => {
    render(<HomeHero />)
    const subtitle = screen.getByTestId('home-subtitle')
    expect(subtitle.textContent).toMatch(
      /independent reference on self-directed precious metals IRAs/i,
    )
  })

  it('renders two hero CTAs: start-reading (featured pillar) and live-spot-prices', () => {
    render(<HomeHero />)
    expect(
      screen.getByRole('link', { name: /start with ira rules/i }),
    ).toHaveAttribute('href', '/ira-rules')
    expect(
      screen.getByRole('link', { name: /see live spot prices/i }),
    ).toHaveAttribute('href', '/tools/live-spot-prices')
  })

  it('renders the OwnershipLockup (light tone)', () => {
    render(<HomeHero />)
    expect(screen.getByTestId('ownership-lockup')).toBeInTheDocument()
  })

  it('renders the HeroBackdrop SVG (marked aria-hidden)', () => {
    const { container } = render(<HomeHero />)
    const svg = container.querySelector('svg[aria-hidden="true"]')
    expect(svg).not.toBeNull()
  })

  it('renders the MarketPulseCard', () => {
    render(<HomeHero />)
    expect(
      screen.getByRole('complementary', { name: /market pulse/i }),
    ).toBeInTheDocument()
  })

  it('exposes the hero as a named region landmark', () => {
    render(<HomeHero />)
    expect(
      screen.getByRole('region', { name: /site introduction/i }),
    ).toBeInTheDocument()
  })
})
