import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ReviewedByBadge } from './ReviewedByBadge'

const reviewer = {
  name: 'Jane Expert, CFA',
  slug: 'jane-expert',
  credentials: [
    {
      name: 'CFA',
      credentialCategory: 'certification' as const,
      recognizedBy: 'CFA Institute',
    },
  ],
}

describe('ReviewedByBadge', () => {
  it('renders reviewer name and review date', () => {
    render(
      <ReviewedByBadge
        reviewer={reviewer}
        reviewedAt="2026-04-19T10:00:00Z"
      />,
    )
    expect(screen.getByText(/Reviewed by/i)).toBeInTheDocument()
    expect(screen.getByText('Jane Expert, CFA')).toBeInTheDocument()
    expect(screen.getByText(/April 19, 2026/)).toBeInTheDocument()
  })

  it('lists each credential explicitly', () => {
    render(
      <ReviewedByBadge
        reviewer={reviewer}
        reviewedAt="2026-04-19T10:00:00Z"
      />,
    )
    expect(screen.getByText(/CFA · CFA Institute/)).toBeInTheDocument()
  })

  it('renders nothing visible when reviewer is missing', () => {
    const { container } = render(
      <ReviewedByBadge reviewer={null} reviewedAt={null} />,
    )
    expect(container).toBeEmptyDOMElement()
  })
})
