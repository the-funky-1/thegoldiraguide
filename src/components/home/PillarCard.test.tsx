import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { pillarBySlug } from '@/lib/site-map'
import { PillarCard } from './PillarCard'

describe('PillarCard', () => {
  const pillar = pillarBySlug('ira-rules')!

  it('renders the pillar label as a heading', () => {
    render(<PillarCard pillar={pillar} />)
    expect(
      screen.getByRole('heading', { level: 3, name: pillar.label }),
    ).toBeInTheDocument()
  })

  it('renders the pillar summary', () => {
    render(<PillarCard pillar={pillar} />)
    expect(screen.getByText(pillar.summary)).toBeInTheDocument()
  })

  it('renders the uppercase eyebrow using the shortLabel', () => {
    render(<PillarCard pillar={pillar} />)
    const eyebrow = screen.getByTestId('pillar-eyebrow')
    expect(eyebrow.textContent).toMatch(new RegExp(pillar.shortLabel, 'i'))
    expect(eyebrow.className).toMatch(/uppercase/)
  })

  it('wraps the whole card in a link to the pillar route', () => {
    render(<PillarCard pillar={pillar} />)
    const link = screen.getByRole('link', {
      name: new RegExp(pillar.label, 'i'),
    })
    expect(link).toHaveAttribute('href', '/ira-rules')
  })
})
