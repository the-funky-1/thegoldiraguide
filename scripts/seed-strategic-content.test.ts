import { describe, expect, it } from 'vitest'
import { planUpserts } from './seed-strategic-content'
import type { ArticleSeed } from '../src/content/strategic/types'

const seed: ArticleSeed = {
  _id: 'article.ira-rules.eligible-metals',
  pillar: 'ira-rules',
  slug: 'eligible-metals',
  title: 'T',
  summary: 'S'.repeat(50),
  metaTitle: 'Meta Title Here',
  metaDescription:
    'Meta description here, well within the 160 character limit and descriptive of content.',
  schemaJsonLdType: 'FAQPage',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane-doe',
  body: [
    {
      _key: 'intro',
      _type: 'block',
      children: [{ _type: 'span', text: 'Body.' }],
    },
  ],
  faqs: [{ question: 'Q?', answer: 'A'.repeat(25) }],
  crossLinks: ['ira-rules/collectible-prohibition'],
  citations: [{ label: 'IRS', url: 'https://irs.gov', accessed: '2026-04-19' }],
}

describe('planUpserts', () => {
  it('produces one createOrReplace mutation per seed', () => {
    const mutations = planUpserts([seed], {
      authorIdBySlug: { 'jane-doe': 'author.jane-doe' },
      pillarIdBySlug: { 'ira-rules': 'pillar.ira-rules' },
    })
    expect(mutations).toHaveLength(1)
    expect(mutations[0]).toHaveProperty('createOrReplace')
    expect(mutations[0]!.createOrReplace._id).toBe(
      'article.ira-rules.eligible-metals',
    )
    expect(mutations[0]!.createOrReplace._type).toBe('article')
    expect(mutations[0]!.createOrReplace.pillar).toEqual({
      _type: 'reference',
      _ref: 'pillar.ira-rules',
    })
    expect(mutations[0]!.createOrReplace.author).toEqual({
      _type: 'reference',
      _ref: 'author.jane-doe',
    })
  })

  it('throws when referenced author is missing', () => {
    expect(() =>
      planUpserts([seed], {
        authorIdBySlug: {},
        pillarIdBySlug: { 'ira-rules': 'pillar.ira-rules' },
      }),
    ).toThrow(/author.*jane-doe/)
  })

  it('throws when referenced pillar is missing', () => {
    expect(() =>
      planUpserts([seed], {
        authorIdBySlug: { 'jane-doe': 'author.jane-doe' },
        pillarIdBySlug: {},
      }),
    ).toThrow(/pillar.*ira-rules/)
  })
})
