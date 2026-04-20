import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleTemplate } from '@/components/editorial/ArticleTemplate'
import { articleHref, pillarHref, pillarLabel } from '@/lib/site-map'
import { extractFaqs } from '@/seo/extract-faqs'
import { JsonLd } from '@/seo/json-ld'
import { buildArticle } from '@/seo/schemas/article'
import { buildBreadcrumbList } from '@/seo/schemas/breadcrumb-list'
import { buildFaqPage } from '@/seo/schemas/faq-page'
import { getArticleBySlug, listArticleSlugsByPillar } from '@/sanity/fetchers'

export const revalidate = 3600

const pillarSlug = 'about' as const
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'

type Article = Parameters<typeof ArticleTemplate>[0]['article'] & {
  pillar?: { slug: string }
  citations?: Array<{ label: string; url: string; accessed?: string }>
}

export async function generateStaticParams() {
  try {
    const slugs = await listArticleSlugsByPillar(pillarSlug)
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
    alternates: { canonical: articleHref(pillarSlug, slug) },
  }
}

export default async function AboutArticle({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticleBySlug<Article>(slug)
  if (!article || article.pillar?.slug !== pillarSlug) notFound()

  const articleLd = buildArticle({
    siteUrl,
    pillarSlug,
    slug,
    title: article.title,
    ...(article.summary ? { summary: article.summary } : {}),
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    author: {
      name: article.author.name,
      slug: article.author.slug,
    },
    reviewer: article.reviewedBy?.reviewer
      ? {
          name: article.reviewedBy.reviewer.name,
          slug: article.reviewedBy.reviewer.slug,
        }
      : null,
    ...(article.citations ? { citations: article.citations } : {}),
  })
  const breadcrumbsLd = buildBreadcrumbList({
    siteUrl,
    items: [
      { label: 'Home', path: '/' },
      { label: pillarLabel(pillarSlug), path: pillarHref(pillarSlug) },
      { label: article.title, path: articleHref(pillarSlug, slug) },
    ],
  })
  const faqLd = buildFaqPage({
    url: `${siteUrl}${articleHref(pillarSlug, slug)}`,
    qas: extractFaqs(article.body as never),
  })

  return (
    <>
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbsLd} />
      <JsonLd data={faqLd} />
      <ArticleTemplate pillarSlug={pillarSlug} article={article} />
    </>
  )
}
