import { describe, expect, it } from 'vitest'
import { portableTextToMarkdown } from './markdown'

const blocks = [
  { _type: 'block', style: 'h2', children: [{ text: 'Heading' }] },
  { _type: 'block', style: 'normal', children: [{ text: 'Hello world.' }] },
  { _type: 'faq', question: 'Q1?', answer: 'A1.' },
  { _type: 'callout', tone: 'warning', body: 'Careful.' },
  {
    _type: 'llmsOnly',
    children: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ text: 'Machine-only fact.' }],
      },
    ],
  },
  {
    _type: 'llmsIgnore',
    children: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ text: 'Marketing CTA.' }],
      },
    ],
  },
]

describe('portableTextToMarkdown', () => {
  it('includes llmsOnly content and omits llmsIgnore content', () => {
    const md = portableTextToMarkdown(blocks)
    expect(md).toContain('Machine-only fact.')
    expect(md).not.toContain('Marketing CTA.')
  })

  it('renders h2 as "## Heading"', () => {
    const md = portableTextToMarkdown(blocks)
    expect(md).toMatch(/^## Heading$/m)
  })

  it('renders FAQ as "### Q1?" followed by answer', () => {
    const md = portableTextToMarkdown(blocks)
    expect(md).toContain('### Q1?')
    expect(md).toContain('A1.')
  })

  it('renders callout as a blockquote with the tone prefix', () => {
    const md = portableTextToMarkdown(blocks)
    expect(md).toContain('> **Warning:** Careful.')
  })
})
