import type { Metadata } from 'next'
import { PillarIndexPage } from '@/components/editorial/PillarIndexPage'
import { pillarBySlug } from '@/lib/site-map'
import { listArticlesByPillar } from '@/sanity/fetchers'

const pillar = pillarBySlug('metals')!

export const metadata: Metadata = {
  title: pillar.label,
  description: pillar.summary,
  alternates: { canonical: '/metals' },
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

export default async function MetalsIndex() {
  let articles: ArticleCard[] = []
  try {
    articles = await listArticlesByPillar<ArticleCard>('metals')
  } catch {
    articles = []
  }
  return <PillarIndexPage pillarSlug="metals" articles={articles} />
}
