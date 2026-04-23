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
      screen.getByText(/owned by Liberty Gold Silver, a precious metals dealer/i),
    ).toBeInTheDocument()
  })

  it('states that no products are sold on this site', () => {
    render(<DisclosureBanner />)
    expect(
      screen.getByText(/No products are sold on this site/i),
    ).toBeInTheDocument()
  })

  it('links to the full disclosure and the privacy policy', () => {
    render(<DisclosureBanner />)
    expect(
      screen.getByRole('link', { name: /full disclosure/i }),
    ).toHaveAttribute('href', '/about/ftc-disclosure')
    expect(
      screen.getByRole('link', { name: /privacy policy/i }),
    ).toHaveAttribute('href', '/privacy')
  })

  it('does not repeat sales language about "written estimates" or "binding"', () => {
    render(<DisclosureBanner />)
    const region = screen.getByRole('region', { name: /ftc disclosure/i })
    expect(region.textContent ?? '').not.toMatch(/binding written estimate/i)
    expect(region.textContent ?? '').not.toMatch(/institutional standard/i)
  })

  it('is not visually hidden', () => {
    render(<DisclosureBanner />)
    const region = screen.getByRole('region', { name: /ftc disclosure/i })
    expect(region).toBeVisible()
  })
})
