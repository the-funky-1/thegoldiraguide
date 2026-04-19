import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Breadcrumbs } from './Breadcrumbs'

describe('Breadcrumbs', () => {
  it('renders the home + pillar + page trail', () => {
    render(
      <Breadcrumbs
        items={[
          { href: '/', label: 'Home' },
          { href: '/accountability', label: 'Accountability' },
          { label: 'Understanding spreads' },
        ]}
      />,
    )
    const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
    const links = within(nav).getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/')
    expect(links[1]).toHaveAttribute('href', '/accountability')
    expect(within(nav).getByText('Understanding spreads')).toBeInTheDocument()
  })

  it('marks the last item with aria-current="page"', () => {
    render(
      <Breadcrumbs
        items={[
          { href: '/', label: 'Home' },
          { label: 'Accountability' },
        ]}
      />,
    )
    expect(screen.getByText('Accountability')).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})
