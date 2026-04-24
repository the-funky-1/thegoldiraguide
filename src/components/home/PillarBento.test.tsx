import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PILLARS } from '@/lib/site-map'
import { PillarBento } from './PillarBento'

describe('PillarBento', () => {
  it('renders a region with an accessible name', () => {
    render(<PillarBento />)
    expect(
      screen.getByRole('region', { name: /pillars/i }),
    ).toBeInTheDocument()
  })

  it('renders exactly one FeaturedPillarCard', () => {
    render(<PillarBento />)
    expect(screen.getAllByTestId('featured-eyebrow')).toHaveLength(1)
  })

  it('renders a PillarCard for every non-featured pillar', () => {
    render(<PillarBento />)
    const region = screen.getByRole('region', { name: /pillars/i })
    const nonFeatured = PILLARS.filter((p) => p.slug !== 'ira-rules')
    for (const p of nonFeatured) {
      expect(
        within(region).getByRole('heading', { level: 3, name: p.label }),
      ).toBeInTheDocument()
    }
  })

  it('places featured pillar first in DOM order', () => {
    render(<PillarBento />)
    const region = screen.getByRole('region', { name: /pillars/i })
    const headings = within(region).getAllByRole('heading')
    expect(headings[0]?.tagName).toBe('H2')
  })
})
