import type { Metadata } from 'next'
import { PillarIndexPage } from '@/components/editorial/PillarIndexPage'
import { pillarBySlug } from '@/lib/site-map'
import { listArticlesByPillar } from '@/sanity/fetchers'

const pillar = pillarBySlug('reviews')!

export const metadata: Metadata = {
  title: pillar.label,
  description: pillar.summary,
  alternates: { canonical: '/reviews' },
}

export const revalidate = 3600

type ArticleCard = {
  _id: string
  title: string
  slug: string
  summary?: string
  publishedAt: string
  updatedAt: string
}

export default async function ReviewsIndex() {
  let articles: ArticleCard[] = []
  try {
    articles = await listArticlesByPillar<ArticleCard>('reviews')
  } catch {
    articles = []
  }
  return <PillarIndexPage pillarSlug="reviews" articles={articles} />
}
