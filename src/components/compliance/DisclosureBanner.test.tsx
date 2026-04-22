import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DisclosureBanner } from './DisclosureBanner'

describe('DisclosureBanner', () => {
  it('renders with the landmark role="region" and accessible name', () => {
    render(<DisclosureBanner />)
    const region = screen.getByRole('region', { name: /ftc disclosure/i })
    expect(region).toBeInTheDocument()
  })

  it('names Liberty Gold Silver as the owning entity', () => {
    render(<DisclosureBanner />)
    expect(
      screen.getByText(/wholly owned and operated by Liberty Gold Silver/i),
    ).toBeInTheDocument()
  })

  it('explicitly states no outbound analytics sales use and no on-site product sales', () => {
    render(<DisclosureBanner />)
    expect(
      screen.getByText(/do not sell products on this site/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/do not use analytics data for outbound sales calls/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/privacy policy/i)).toBeInTheDocument()
  })

  it('is not visually hidden', () => {
    render(<DisclosureBanner />)
    const region = screen.getByRole('region', { name: /ftc disclosure/i })
    expect(region).toBeVisible()
  })

  it('accepts no prop to suppress itself', () => {
    const result = render(<DisclosureBanner />)
    expect(result.container.firstChild).not.toBeNull()
  })
})
