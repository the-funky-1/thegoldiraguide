import { sanityClient } from './client'
import {
  allArticleSlugsQuery,
  allAuthorsQuery,
  allFeeSchedulesQuery,
  articleBySlugQuery,
  articleSlugsByPillarQuery,
  articlesByPillarQuery,
  authorBySlugQuery,
  feeScheduleBySlugQuery,
  pillarsQuery,
} from './queries'

async function tagged<T>(
  query: string,
  params: Record<string, unknown>,
  tags: string[],
): Promise<T> {
  // `next` is passed through to Next.js fetch cache for tag-based revalidation.
  return sanityClient.fetch<T>(query, params, { next: { tags } })
}

export async function getArticleBySlug<T = unknown>(
  slug: string,
): Promise<T | null> {
  const result = await tagged<T | null>(articleBySlugQuery, { slug }, [
    `article:${slug}`,
    'article',
  ])
  return result ?? null
}

export async function listArticleSlugs(): Promise<string[]> {
  const rows = await tagged<{ slug: string }[]>(allArticleSlugsQuery, {}, [
    'article',
  ])
  return rows.map((r) => r.slug)
}

export async function listPillars<T = unknown>(): Promise<T[]> {
  return tagged<T[]>(pillarsQuery, {}, ['pillar'])
}

export async function getFeeScheduleBySlug<T = unknown>(
  slug: string,
): Promise<T | null> {
  const result = await tagged<T | null>(feeScheduleBySlugQuery, { slug }, [
    `feeSchedule:${slug}`,
    'feeSchedule',
  ])
  return result ?? null
}

export async function listFeeSchedules<T = unknown>(): Promise<T[]> {
  return tagged<T[]>(allFeeSchedulesQuery, {}, ['feeSchedule'])
}

export async function listArticlesByPillar<T = unknown>(
  pillar: string,
): Promise<T[]> {
  return tagged<T[]>(articlesByPillarQuery, { pillar }, [
    `pillar:${pillar}`,
    'article',
  ])
}

export async function listArticleSlugsByPillar(
  pillar: string,
): Promise<string[]> {
  const rows = await tagged<{ slug: string }[]>(
    articleSlugsByPillarQuery,
    { pillar },
    [`pillar:${pillar}`, 'article'],
  )
  return rows.map((r) => r.slug)
}

export async function getAuthorBySlug<T = unknown>(
  slug: string,
): Promise<T | null> {
  const result = await tagged<T | null>(authorBySlugQuery, { slug }, [
    `author:${slug}`,
    'author',
  ])
  return result ?? null
}

export async function listAuthors<T = unknown>(): Promise<T[]> {
  return tagged<T[]>(allAuthorsQuery, {}, ['author'])
}
