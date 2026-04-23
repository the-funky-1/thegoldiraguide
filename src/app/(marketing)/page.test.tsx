import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HomePage from './page'

describe('HomePage', () => {
  it('renders the site title as the h1', () => {
    render(<HomePage />)
    expect(
      screen.getByRole('heading', { level: 1, name: /the gold ira guide/i }),
    ).toBeInTheDocument()
  })

  it('uses a reader-focused subtitle (no "owned and operated by" phrasing)', () => {
    render(<HomePage />)
    expect(
      screen.getByText(
        /independent reference on self-directed precious metals IRAs/i,
      ),
    ).toBeInTheDocument()
    const subtitle = screen.getByTestId('home-subtitle')
    expect(subtitle.textContent ?? '').not.toMatch(/owned and operated by/i)
    expect(subtitle.textContent ?? '').not.toMatch(/binding written estimate/i)
  })

  it('renders the ownership lockup below the hero', () => {
    render(<HomePage />)
    expect(screen.getByTestId('ownership-lockup')).toBeInTheDocument()
  })
})
