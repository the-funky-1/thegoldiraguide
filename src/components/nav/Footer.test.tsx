import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Footer } from './Footer'

describe('Footer', () => {
  it('renders a <footer> landmark', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('includes all five pillar links and required accountability links', () => {
    render(<Footer />)
    for (const label of [
      'IRA Rules',
      'Accountability',
      'Economics',
      'Tools',
      'About',
    ]) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }
    expect(
      screen.getByRole('link', { name: /editorial guidelines/i }),
    ).toHaveAttribute('href', '/about/editorial-guidelines')
    expect(
      screen.getByRole('link', { name: /ftc disclosure/i }),
    ).toHaveAttribute('href', '/about/ftc-disclosure')
    expect(
      screen.getByRole('link', { name: /privacy and analytics/i }),
    ).toHaveAttribute('href', '/privacy')
  })

  it('shows the copyright with the current year', () => {
    render(<Footer />)
    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument()
  })
})
