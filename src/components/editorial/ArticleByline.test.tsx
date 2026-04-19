import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ArticleByline } from './ArticleByline'

const author = { name: 'Alex Writer', slug: 'alex', jobTitle: 'Senior Editor' }

describe('ArticleByline', () => {
  it('renders author name linking to profile, job title, and updated date', () => {
    render(
      <ArticleByline
        author={author}
        publishedAt="2026-04-01T00:00:00Z"
        updatedAt="2026-04-19T10:30:00Z"
      />,
    )
    const link = screen.getByRole('link', { name: 'Alex Writer' })
    expect(link).toHaveAttribute('href', '/about/expert-authors/alex')
    expect(screen.getByText(/Senior Editor/)).toBeInTheDocument()
    expect(screen.getByText(/Last updated/)).toBeInTheDocument()
    expect(screen.getByText(/April 19, 2026/)).toBeInTheDocument()
  })
})
