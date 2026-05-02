import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HeroBackdrop } from './HeroBackdrop'

describe('HeroBackdrop', () => {
  it('renders an inline SVG marked aria-hidden', () => {
    const { container } = render(<HeroBackdrop />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('focusable', 'false')
  })

  it('uses preserveAspectRatio slice so the pattern fills the container', () => {
    const { container } = render(<HeroBackdrop />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid slice')
  })

  it('contains a radial highlight and at least one guilloche line path', () => {
    const { container } = render(<HeroBackdrop />)
    expect(container.querySelector('radialGradient')).not.toBeNull()
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0)
  })
})
