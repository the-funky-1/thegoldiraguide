import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PortableTextRenderer } from './PortableTextRenderer'

const blocks = [
  {
    _type: 'block',
    _key: 'a',
    style: 'h2',
    children: [{ _type: 'span', _key: 's1', text: 'Heading' }],
  },
  {
    _type: 'block',
    _key: 'b',
    style: 'normal',
    children: [{ _type: 'span', _key: 's2', text: 'Paragraph.' }],
  },
  { _type: 'callout', _key: 'c', tone: 'warning', body: 'Be careful.' },
  { _type: 'faq', _key: 'f', question: 'Q?', answer: 'A.' },
]

describe('PortableTextRenderer', () => {
  it('renders headings, paragraphs, callouts, and FAQ pairs', () => {
    render(<PortableTextRenderer value={blocks as never} />)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Heading' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Paragraph.')).toBeInTheDocument()
    expect(screen.getByText('Be careful.')).toBeInTheDocument()
    expect(screen.getByText('Q?')).toBeInTheDocument()
    expect(screen.getByText('A.')).toBeInTheDocument()
  })

  it('marks the callout region with role="note"', () => {
    render(<PortableTextRenderer value={blocks as never} />)
    const note = screen.getByRole('note')
    expect(note).toHaveTextContent('Be careful.')
  })
})
