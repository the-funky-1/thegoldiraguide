import { describe, expect, it } from 'vitest'
import { extractFaqs } from './extract-faqs'

describe('extractFaqs', () => {
  it('extracts only faq blocks', () => {
    expect(
      extractFaqs([
        { _type: 'block' },
        { _type: 'faq', question: 'Q', answer: 'A' },
        { _type: 'faq', question: '', answer: 'A' },
      ]),
    ).toEqual([{ question: 'Q', answer: 'A' }])
  })

  it('handles undefined input', () => {
    expect(extractFaqs(undefined)).toEqual([])
  })
})
