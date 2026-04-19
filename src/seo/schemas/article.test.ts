import { describe, expect, it } from 'vitest'
import { buildArticle } from './article'

const input = {
  siteUrl: 'https://example.test',
  pillarSlug: 'ira-rules' as const,
  slug: 'eligible-metals',
  title: 'Eligible metals',
  summary: 'Which metals qualify.',
  publishedAt: '2026-04-01T00:00:00Z',
  updatedAt: '2026-04-19T00:00:00Z',
  author: { name: 'Jane Author', slug: 'jane' },
  reviewer: { name: 'Rev Iewer', slug: 'rev' } as {
    name: string
    slug: string
  } | null,
}

describe('buildArticle', () => {
  it('produces @type=Article with dateModified, url, headline, publisher', () => {
    const a = buildArticle(input)
    expect(a['@type']).toBe('Article')
    expect(a.headline).toBe('Eligible metals')
    expect(a.url).toBe('https://example.test/ira-rules/eligible-metals')
    expect(a.datePublished).toBe('2026-04-01T00:00:00Z')
    expect(a.dateModified).toBe('2026-04-19T00:00:00Z')
    expect(a.publisher).toMatchObject({
      '@type': 'Organization',
      name: 'The Gold IRA Guide',
    })
  })

  it('emits Person for author and reviewer when present', () => {
    const a = buildArticle(input)
    expect(a.author).toMatchObject({
      '@type': 'Person',
      name: 'Jane Author',
      url: 'https://example.test/about/expert-authors/jane',
    })
    expect(a.reviewedBy).toMatchObject({
      '@type': 'Person',
      name: 'Rev Iewer',
      url: 'https://example.test/about/expert-authors/rev',
    })
  })

  it('omits reviewedBy when reviewer is null', () => {
    const a = buildArticle({ ...input, reviewer: null })
    expect(a.reviewedBy).toBeUndefined()
  })
})
