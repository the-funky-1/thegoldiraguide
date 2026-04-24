import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { pillarBySlug } from '@/lib/site-map'
import { FeaturedPillarCard } from './FeaturedPillarCard'

describe('FeaturedPillarCard', () => {
  const pillar = pillarBySlug('ira-rules')!

  it('renders a "Featured" eyebrow (not the pillar shortLabel)', () => {
    render(<FeaturedPillarCard pillar={pillar} />)
    const eyebrow = screen.getByTestId('featured-eyebrow')
    expect(eyebrow.textContent).toMatch(/featured/i)
    expect(eyebrow.className).toMatch(/uppercase/)
  })

  it('renders the pillar label as an h2 (not h3, so it outranks standard cards)', () => {
    render(<FeaturedPillarCard pillar={pillar} />)
    expect(
      screen.getByRole('heading', { level: 2, name: pillar.label }),
    ).toBeInTheDocument()
  })

  it('renders the pillar summary as the dek', () => {
    render(<FeaturedPillarCard pillar={pillar} />)
    expect(screen.getByText(pillar.summary)).toBeInTheDocument()
  })

  it('renders a "Start here" call to action linked to the pillar route', () => {
    render(<FeaturedPillarCard pillar={pillar} />)
    const cta = screen.getByRole('link', { name: /start here/i })
    expect(cta).toHaveAttribute('href', '/ira-rules')
  })
})
