import { sanityClient } from './client'
import {
  allArticleSlugsQuery,
  allFeeSchedulesQuery,
  articleBySlugQuery,
  feeScheduleBySlugQuery,
  pillarsQuery,
} from './queries'

type FetchOpts = { tags: string[] }

async function tagged<T>(
  query: string,
  params: Record<string, unknown>,
  tags: string[],
): Promise<T> {
  return sanityClient.fetch<T>(query, params, { next: { tags } } as FetchOpts)
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
