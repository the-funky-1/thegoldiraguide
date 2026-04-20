import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleTemplate } from '@/components/editorial/ArticleTemplate'
import { articleHref } from '@/lib/site-map'
import { extractFaqs } from '@/seo/extract-faqs'
import { JsonLd } from '@/seo/json-ld'
import { buildArticle } from '@/seo/schemas/article'
import { buildBreadcrumbList } from '@/seo/schemas/breadcrumb-list'
import { buildFaqPage } from '@/seo/schemas/faq-page'
import { getArticleBySlug } from '@/sanity/fetchers'

export const revalidate = 3600

const pillarSlug = 'tools' as const
const slug = 'correlation-matrix'
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'

type Article = Parameters<typeof ArticleTemplate>[0]['article'] & {
  pillar?: { slug: string }
  citations?: Array<{ label: string; url: string; accessed?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const article = await getArticleBySlug<{
    title: string
    summary?: string
  }>(slug)
  return {
    title: article?.title ?? 'Asset Class Correlation Matrix',
    description:
      article?.summary ??
      'Historical correlation between stocks, bonds, and precious metals, with a plain-language explainer on what the numbers mean.',
    alternates: { canonical: articleHref(pillarSlug, slug) },
  }
}

export default async function CorrelationMatrixPage() {
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
      { label: 'Tools', path: '/tools' },
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
      <div className="mx-auto max-w-3xl px-6 pt-10">
        <div
          role="status"
          className="mb-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-amber-900"
        >
          The interactive correlation matrix is launching soon. Until then, the
          explainer below describes how correlation between asset classes works
          and what the historical record shows.
        </div>
      </div>
      <ArticleTemplate pillarSlug={pillarSlug} article={article} />
    </>
  )
}
