import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Header } from './Header'

describe('Header', () => {
  it('includes a <header> landmark', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('contains a skip-to-content link and the primary pillar nav', () => {
    render(<Header />)
    expect(
      screen.getByRole('link', { name: /skip to main content/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: /primary/i }),
    ).toBeInTheDocument()
  })

  it('home link points to /', () => {
    render(<Header />)
    const home = screen.getByRole('link', { name: /the gold ira guide/i })
    expect(home).toHaveAttribute('href', '/')
  })
})
