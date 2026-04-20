import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LinkButton } from './link-button'

describe('LinkButton', () => {
  it('renders as an anchor with the correct href', () => {
    render(<LinkButton href="/tools">Tools</LinkButton>)
    expect(screen.getByRole('link', { name: 'Tools' })).toHaveAttribute(
      'href',
      '/tools',
    )
  })

  it('applies intent=primary classes by default', () => {
    render(<LinkButton href="/x">x</LinkButton>)
    const link = screen.getByRole('link', { name: 'x' })
    expect(link.className).toContain('bg-brand-navy')
  })

  it('respects min-touch class for WCAG 2.5.8', () => {
    render(<LinkButton href="/x">x</LinkButton>)
    expect(screen.getByRole('link', { name: 'x' }).className).toContain(
      'min-h-touch',
    )
  })
})
