import { describe, expect, it, vi, beforeEach } from 'vitest'

// Mock must be hoisted — see vitest docs on vi.mock.
vi.mock('./client', () => ({
  sanityClient: { fetch: vi.fn() },
}))

import { sanityClient } from './client'
import {
  getArticleBySlug,
  getAuthorBySlug,
  listArticleSlugs,
  listArticlesByPillar,
  listAuthors,
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

describe('listArticlesByPillar', () => {
  it('passes the pillar slug as a GROQ parameter and tags the result', async () => {
    mockedFetch.mockResolvedValue([])
    await listArticlesByPillar('accountability')
    expect(mockedFetch).toHaveBeenCalledWith(
      expect.stringContaining('pillar->slug.current == $pillar'),
      { pillar: 'accountability' },
      expect.objectContaining({
        next: expect.objectContaining({
          tags: expect.arrayContaining(['pillar:accountability', 'article']),
        }),
      }),
    )
  })
})

describe('getAuthorBySlug', () => {
  it('returns null when the author is missing', async () => {
    mockedFetch.mockResolvedValue(null)
    expect(await getAuthorBySlug('missing')).toBeNull()
  })
  it('tags with author:<slug>', async () => {
    mockedFetch.mockResolvedValue({ _id: '1', name: 'Jane' })
    await getAuthorBySlug('jane')
    expect(mockedFetch).toHaveBeenCalledWith(
      expect.any(String),
      { slug: 'jane' },
      expect.objectContaining({
        next: expect.objectContaining({
          tags: expect.arrayContaining(['author:jane']),
        }),
      }),
    )
  })
})

describe('listAuthors', () => {
  it('tags the result with author', async () => {
    mockedFetch.mockResolvedValue([])
    await listAuthors()
    expect(mockedFetch).toHaveBeenCalledWith(
      expect.any(String),
      {},
      expect.objectContaining({
        next: expect.objectContaining({ tags: ['author'] }),
      }),
    )
  })
})
