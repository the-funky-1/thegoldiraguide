import { describe, expect, it, vi, beforeEach } from 'vitest'

// Mock must be hoisted — see vitest docs on vi.mock.
vi.mock('./client', () => ({
  sanityClient: { fetch: vi.fn() },
}))

import { sanityClient } from './client'
import {
  getArticleBySlug,
  listArticleSlugs,
  listFeeSchedules,
} from './fetchers'

const mockedFetch = sanityClient.fetch as unknown as ReturnType<typeof vi.fn>

beforeEach(() => {
  mockedFetch.mockReset()
})

describe('getArticleBySlug', () => {
  it('returns null when no article matches', async () => {
    mockedFetch.mockResolvedValue(null)
    const result = await getArticleBySlug('missing')
    expect(result).toBeNull()
  })

  it('passes slug as a named GROQ parameter', async () => {
    mockedFetch.mockResolvedValue({ _id: '1', title: 'x', slug: 'x' })
    await getArticleBySlug('x')
    expect(mockedFetch).toHaveBeenCalledWith(
      expect.stringContaining('slug.current == $slug'),
      { slug: 'x' },
      expect.objectContaining({
        next: expect.objectContaining({ tags: ['article:x', 'article'] }),
      }),
    )
  })
})

describe('listArticleSlugs', () => {
  it('returns an array of string slugs', async () => {
    mockedFetch.mockResolvedValue([{ slug: 'a' }, { slug: 'b' }])
    const slugs = await listArticleSlugs()
    expect(slugs).toEqual(['a', 'b'])
  })
})

describe('listFeeSchedules', () => {
  it('tags the result for revalidation', async () => {
    mockedFetch.mockResolvedValue([])
    await listFeeSchedules()
    expect(mockedFetch).toHaveBeenCalledWith(
      expect.any(String),
      {},
      expect.objectContaining({
        next: expect.objectContaining({ tags: ['feeSchedule'] }),
      }),
    )
  })
})
