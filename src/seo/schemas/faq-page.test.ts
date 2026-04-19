import { describe, expect, it } from 'vitest'
import { buildFaqPage } from './faq-page'

describe('buildFaqPage', () => {
  it('returns null when there are no Q&As (no FAQPage to emit)', () => {
    expect(buildFaqPage({ url: 'https://x.test', qas: [] })).toBeNull()
  })

  it('maps each Q&A to a Question with an acceptedAnswer', () => {
    const fp = buildFaqPage({
      url: 'https://x.test/x',
      qas: [
        { question: 'Q1?', answer: 'A1.' },
        { question: 'Q2?', answer: 'A2.' },
      ],
    })!
    const mainEntity = fp.mainEntity as Array<{
      '@type': string
      name: string
      acceptedAnswer: { '@type': string; text: string }
    }>
    expect(mainEntity).toHaveLength(2)
    expect(mainEntity[0]).toMatchObject({
      '@type': 'Question',
      name: 'Q1?',
      acceptedAnswer: { '@type': 'Answer', text: 'A1.' },
    })
  })
})
