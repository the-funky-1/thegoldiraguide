import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OwnershipLockup } from './OwnershipLockup'

describe('OwnershipLockup', () => {
  it('renders the "An educational project by" preamble', () => {
    render(<OwnershipLockup />)
    expect(screen.getByText(/an educational project by/i)).toBeInTheDocument()
  })

  it('renders the Liberty Gold Silver wordmark as inline SVG, hidden from AT', () => {
    const { container } = render(<OwnershipLockup />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg?.textContent).toMatch(/liberty gold silver/i)
  })

  it('links the lockup to the /about/liberty-gold-silver page with an accessible name', () => {
    render(<OwnershipLockup />)
    const link = screen.getByRole('link', {
      name: /liberty gold silver/i,
    })
    expect(link).toHaveAttribute('href', '/about/liberty-gold-silver')
  })

  it('accepts a `tone` prop to switch between light and dark surfaces', () => {
    const { rerender } = render(<OwnershipLockup tone="dark" />)
    const dark = screen.getByTestId('ownership-lockup')
    expect(dark.className).toMatch(/text-brand-platinum/)

    rerender(<OwnershipLockup tone="light" />)
    const light = screen.getByTestId('ownership-lockup')
    expect(light.className).toMatch(/text-brand-slate/)
  })
})
