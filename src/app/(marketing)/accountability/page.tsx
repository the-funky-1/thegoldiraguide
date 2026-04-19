import type { Metadata } from 'next'
import { PillarIndexPage } from '@/components/editorial/PillarIndexPage'
import { pillarBySlug } from '@/lib/site-map'
import { listArticlesByPillar } from '@/sanity/fetchers'

const pillar = pillarBySlug('accountability')!

export const metadata: Metadata = {
  title: pillar.label,
  description: pillar.summary,
  alternates: { canonical: '/accountability' },
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

export default async function AccountabilityIndex() {
  let articles: ArticleCard[] = []
  try {
    articles = await listArticlesByPillar<ArticleCard>('accountability')
  } catch {
    articles = []
  }
  return <PillarIndexPage pillarSlug="accountability" articles={articles} />
}
