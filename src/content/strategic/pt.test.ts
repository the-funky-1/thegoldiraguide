import { describe, expect, it } from 'vitest'
import { block, callout, faq, h2, h3, llmsOnly, p } from './pt'

describe('p', () => {
  it('creates a plain paragraph block', () => {
    expect(p('Hello.')).toMatchObject({
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: 'Hello.' }],
    })
  })
})

describe('h2', () => {
  it('creates an h2 block', () => {
    expect(h2('Heading')).toMatchObject({ style: 'h2' })
  })
})

describe('h3', () => {
  it('creates an h3 block', () => {
    expect(h3('Sub-heading')).toMatchObject({ style: 'h3' })
  })
})

describe('faq', () => {
  it('creates an inline faq object', () => {
    expect(faq('Q?', 'A.')).toEqual({
      _type: 'faq',
      question: 'Q?',
      answer: 'A.',
    })
  })
})

describe('callout', () => {
  it('creates a warning callout', () => {
    expect(callout('warning', 'Be careful.')).toEqual({
      _type: 'callout',
      tone: 'warning',
      body: 'Be careful.',
    })
  })
})

describe('llmsOnly', () => {
  it('wraps children in an llmsOnly block', () => {
    const inner = p('Hidden from humans.')
    expect(llmsOnly([inner])).toEqual({
      _type: 'llmsOnly',
      children: [inner],
    })
  })
})

describe('block', () => {
  it('produces stable _key values per position', () => {
    const b1 = block('b1', p('one'))
    const b2 = block('b2', p('two'))
    expect(b1._key).toBe('b1')
    expect(b2._key).toBe('b2')
  })
})
