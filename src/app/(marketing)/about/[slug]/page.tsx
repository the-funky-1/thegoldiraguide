import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleTemplate } from '@/components/editorial/ArticleTemplate'
import { articleHref } from '@/lib/site-map'
import { getArticleBySlug, listArticleSlugsByPillar } from '@/sanity/fetchers'

export const revalidate = 3600

type Article = Parameters<typeof ArticleTemplate>[0]['article']

export async function generateStaticParams() {
  try {
    const slugs = await listArticleSlugsByPillar('about')
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug<{
    title: string
    summary?: string
  }>(slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: articleHref('about', slug) },
  }
}

export default async function AboutArticle({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticleBySlug<
    Article & { pillar?: { slug: string } }
  >(slug)
  if (!article || article.pillar?.slug !== 'about') notFound()
  return <ArticleTemplate pillarSlug="about" article={article} />
}
