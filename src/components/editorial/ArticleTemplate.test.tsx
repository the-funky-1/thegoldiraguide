import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ArticleTemplate } from './ArticleTemplate'

const article = {
  title: 'Eligible metals',
  summary: 'Which metals qualify for an IRS-approved IRA.',
  publishedAt: '2026-04-01T00:00:00Z',
  updatedAt: '2026-04-19T10:00:00Z',
  author: { name: 'Jane Author', slug: 'jane', jobTitle: 'Editor' },
  reviewedBy: null,
  body: [
    {
      _type: 'block',
      _key: 'h',
      style: 'h2',
      children: [{ _type: 'span', _key: 's', text: 'Gold purity' }],
    },
    {
      _type: 'block',
      _key: 'p',
      style: 'normal',
      children: [{ _type: 'span', _key: 's2', text: 'Body text.' }],
    },
  ],
}

describe('ArticleTemplate', () => {
  it('renders breadcrumbs with Home > Pillar > article title', () => {
    render(
      <ArticleTemplate pillarSlug="ira-rules" article={article as never} />,
    )
    const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
    expect(nav).toHaveTextContent('Home')
    expect(nav).toHaveTextContent('IRA Rules')
    expect(nav).toHaveTextContent('Eligible metals')
  })

  it('renders the article h1, byline, and body', () => {
    render(
      <ArticleTemplate pillarSlug="ira-rules" article={article as never} />,
    )
    expect(
      screen.getByRole('heading', { level: 1, name: 'Eligible metals' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Jane Author')).toBeInTheDocument()
    expect(screen.getByText('Body text.')).toBeInTheDocument()
  })

  it('renders the ToC when there are h2 headings', () => {
    render(
      <ArticleTemplate pillarSlug="ira-rules" article={article as never} />,
    )
    expect(
      screen.getByRole('navigation', { name: /on this page/i }),
    ).toBeInTheDocument()
  })
})
