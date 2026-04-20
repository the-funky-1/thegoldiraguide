import { describe, expect, it } from 'vitest'
import { ArticleSeedSchema } from './types'

const valid = {
  _id: 'article.ira-rules.eligible-metals',
  pillar: 'ira-rules' as const,
  slug: 'eligible-metals',
  title: 'IRS Purity Standards for Precious Metals IRAs',
  summary: 'The exact fineness the IRS requires for gold, silver, platinum, and palladium in a retirement account.',
  metaTitle: 'IRS Purity Standards for Precious Metals IRAs (2026)',
  metaDescription:
    'Review the exact IRS fineness requirements for holding gold, silver, platinum, and palladium in a self-directed retirement account. Eligible bullion list.',
  schemaJsonLdType: 'FAQPage' as const,
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane-doe',
  body: [{ _type: 'block', children: [{ _type: 'span', text: 'Body.' }] }],
  faqs: [
    {
      question: 'What is the gold purity requirement for an IRA?',
      answer: 'The IRS requires 99.5% fineness for gold held in a precious metals IRA.',
    },
  ],
  crossLinks: ['ira-rules/collectible-prohibition'],
  citations: [
    { label: 'IRS Publication 590-A', url: 'https://www.irs.gov/pub/irs-pdf/p590a.pdf', accessed: '2026-04-19' },
  ],
}

describe('ArticleSeedSchema', () => {
  it('accepts a valid seed', () => {
    expect(() => ArticleSeedSchema.parse(valid)).not.toThrow()
  })

  it('rejects meta title over 60 chars', () => {
    expect(() =>
      ArticleSeedSchema.parse({ ...valid, metaTitle: 'x'.repeat(61) }),
    ).toThrow(/metaTitle/)
  })

  it('rejects meta description over 160 chars', () => {
    expect(() =>
      ArticleSeedSchema.parse({ ...valid, metaDescription: 'x'.repeat(161) }),
    ).toThrow(/metaDescription/)
  })

  it('rejects FAQPage schema with zero FAQs', () => {
    expect(() =>
      ArticleSeedSchema.parse({ ...valid, faqs: [] }),
    ).toThrow(/FAQPage requires at least one faq/)
  })

  it('rejects pillar values outside the five known pillars', () => {
    expect(() =>
      ArticleSeedSchema.parse({ ...valid, pillar: 'something-else' }),
    ).toThrow()
  })

  it('rejects cross-links that do not match the <pillar>/<slug> shape', () => {
    expect(() =>
      ArticleSeedSchema.parse({ ...valid, crossLinks: ['not-a-valid-link'] }),
    ).toThrow(/crossLinks/)
  })

  it('requires at least one citation', () => {
    expect(() =>
      ArticleSeedSchema.parse({ ...valid, citations: [] }),
    ).toThrow(/citations/)
  })
})
