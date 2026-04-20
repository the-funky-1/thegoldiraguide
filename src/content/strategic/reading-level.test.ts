import { describe, expect, it } from 'vitest'
import { extractPlainText, fleschKincaidGrade } from './reading-level'

describe('fleschKincaidGrade', () => {
  it('scores a short simple sentence at low grade level', () => {
    const text = 'The cat sat on the mat. The dog ran.'
    expect(fleschKincaidGrade(text)).toBeLessThan(5)
  })

  it('scores an academic sentence at high grade level', () => {
    const text =
      'The implementation ramifications of bureaucratically instantiated collateralization procedures necessitate comprehensive stakeholder reconciliation.'
    expect(fleschKincaidGrade(text)).toBeGreaterThan(14)
  })

  it('throws on empty input', () => {
    expect(() => fleschKincaidGrade('')).toThrow()
  })
})

describe('extractPlainText', () => {
  it('flattens portable-text blocks into prose', () => {
    const body = [
      { _type: 'block', children: [{ _type: 'span', text: 'Hello.' }] },
      { _type: 'block', children: [{ _type: 'span', text: 'World.' }] },
    ]
    expect(extractPlainText(body)).toBe('Hello. World.')
  })

  it('skips llmsOnly blocks (they are supplemental, not reader-facing)', () => {
    const body = [
      { _type: 'block', children: [{ _type: 'span', text: 'Reader text.' }] },
      {
        _type: 'llmsOnly',
        children: [{ _type: 'block', children: [{ _type: 'span', text: 'Hidden.' }] }],
      },
    ]
    expect(extractPlainText(body)).toBe('Reader text.')
  })
})
