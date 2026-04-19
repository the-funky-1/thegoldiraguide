import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PillarNavigationMenu } from './PillarNavigationMenu'

describe('PillarNavigationMenu', () => {
  it('renders exactly five pillar links in canonical order', () => {
    render(<PillarNavigationMenu />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(5)
    expect(links[0]).toHaveTextContent('IRA Rules')
    expect(links[0]).toHaveAttribute('href', '/ira-rules')
    expect(links[4]).toHaveTextContent('About')
    expect(links[4]).toHaveAttribute('href', '/about')
  })

  it('labels the nav region', () => {
    render(<PillarNavigationMenu />)
    expect(
      screen.getByRole('navigation', { name: /primary/i }),
    ).toBeInTheDocument()
  })
})
