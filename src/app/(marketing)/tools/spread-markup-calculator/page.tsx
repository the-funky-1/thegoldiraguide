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
const slug = 'spread-markup-calculator'
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'

type Article = Parameters<typeof ArticleTemplate>[0]['article'] & {
  pillar?: { slug: string }
}

export async function generateMetadata(): Promise<Metadata> {
  const article = await getArticleBySlug<{
    title: string
    summary?: string
  }>(slug)
  return {
    title: article?.title ?? 'Dealer Spread and Markup Calculator',
    description:
      article?.summary ??
      'Calculate the markup above spot price a dealer charges on a quoted physical precious metals product.',
    alternates: { canonical: articleHref(pillarSlug, slug) },
  }
}

export default async function SpreadMarkupCalculatorPage() {
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
          The interactive calculator is launching soon. Until then, the steps
          below show you how to compute a dealer spread by hand.
        </div>
      </div>
      <ArticleTemplate pillarSlug={pillarSlug} article={article} />
    </>
  )
}
