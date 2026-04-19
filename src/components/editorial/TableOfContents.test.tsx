import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TableOfContents, extractHeadings } from './TableOfContents'

const blocks = [
  { _type: 'block', style: 'h2', children: [{ text: 'First section' }] },
  { _type: 'block', style: 'h3', children: [{ text: 'A subsection' }] },
  { _type: 'block', style: 'normal', children: [{ text: 'not a heading' }] },
  { _type: 'block', style: 'h2', children: [{ text: 'Second section' }] },
]

describe('extractHeadings', () => {
  it('extracts only h2 and h3 blocks and slugs them', () => {
    expect(extractHeadings(blocks as never)).toEqual([
      { level: 2, text: 'First section', slug: 'first-section' },
      { level: 3, text: 'A subsection', slug: 'a-subsection' },
      { level: 2, text: 'Second section', slug: 'second-section' },
    ])
  })
})

describe('TableOfContents', () => {
  it('renders links to each heading anchor', () => {
    render(<TableOfContents blocks={blocks as never} />)
    expect(screen.getByRole('link', { name: 'First section' })).toHaveAttribute(
      'href',
      '#first-section',
    )
    expect(screen.getByRole('link', { name: 'A subsection' })).toHaveAttribute(
      'href',
      '#a-subsection',
    )
  })
  it('labels the region', () => {
    render(<TableOfContents blocks={blocks as never} />)
    expect(
      screen.getByRole('navigation', { name: /on this page/i }),
    ).toBeInTheDocument()
  })
  it('renders nothing when there are no headings', () => {
    const { container } = render(<TableOfContents blocks={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
