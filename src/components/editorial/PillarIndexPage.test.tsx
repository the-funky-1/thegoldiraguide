import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PillarIndexPage } from './PillarIndexPage'

const articles = [
  {
    _id: '1',
    title: 'Eligible metals',
    slug: 'eligible-metals',
    summary: 'Which metals qualify.',
    publishedAt: '2026-04-01',
    updatedAt: '2026-04-19',
  },
  {
    _id: '2',
    title: 'Purity standards',
    slug: 'purity-standards',
    summary: '.995 / .999 / .9995',
    publishedAt: '2026-03-01',
    updatedAt: '2026-03-15',
  },
]

describe('PillarIndexPage', () => {
  it('renders the pillar h1 and summary', () => {
    render(<PillarIndexPage pillarSlug="ira-rules" articles={articles} />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'IRA Rules' }),
    ).toBeInTheDocument()
  })

  it('renders every article as a link to /<pillar>/<slug>', () => {
    render(<PillarIndexPage pillarSlug="ira-rules" articles={articles} />)
    expect(
      screen.getByRole('link', { name: /eligible metals/i }),
    ).toHaveAttribute('href', '/ira-rules/eligible-metals')
    expect(
      screen.getByRole('link', { name: /purity standards/i }),
    ).toHaveAttribute('href', '/ira-rules/purity-standards')
  })

  it('shows a helpful empty state when there are no articles', () => {
    render(<PillarIndexPage pillarSlug="ira-rules" articles={[]} />)
    expect(screen.getByText(/no articles published yet/i)).toBeInTheDocument()
  })
})
