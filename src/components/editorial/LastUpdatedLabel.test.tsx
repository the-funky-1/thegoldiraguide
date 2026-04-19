import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LastUpdatedLabel } from './LastUpdatedLabel'

describe('LastUpdatedLabel', () => {
  it('renders a <time> with an ISO datetime attribute', () => {
    render(<LastUpdatedLabel updatedAt="2026-04-19T10:30:00Z" />)
    const el = screen.getByText(/last updated/i).querySelector('time')
    expect(el).toBeInTheDocument()
    expect(el?.getAttribute('datetime')).toBe('2026-04-19T10:30:00Z')
  })

  it('renders human-readable long-form date', () => {
    render(<LastUpdatedLabel updatedAt="2026-04-19T10:30:00Z" />)
    expect(screen.getByText(/April 19, 2026/)).toBeInTheDocument()
  })
})
