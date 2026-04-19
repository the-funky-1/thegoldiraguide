import { notFound } from 'next/navigation'
import { ArticleByline } from '@/components/editorial/ArticleByline'
import { PortableTextRenderer } from '@/components/editorial/PortableTextRenderer'
import { ReviewedByBadge } from '@/components/editorial/ReviewedByBadge'
import { getArticleBySlug, listArticleSlugs } from '@/sanity/fetchers'

export const revalidate = 3600 // 1h ISR fallback

type Article = {
  title: string
  summary?: string
  publishedAt: string
  updatedAt: string
  author: { name: string; slug: string; jobTitle?: string }
  reviewedBy?: {
    reviewedAt: string
    reviewer: { name: string; slug: string; credentials?: unknown[] }
  } | null
  body: unknown
}

export async function generateStaticParams() {
  const slugs = await listArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticleBySlug<Article>(slug)
  if (!article) notFound()

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-bold">{article.title}</h1>
      {article.summary && <p className="mt-4 text-lg">{article.summary}</p>}
      <div className="mt-6">
        <ArticleByline
          author={article.author}
          publishedAt={article.publishedAt}
          updatedAt={article.updatedAt}
        />
      </div>
      {article.reviewedBy && (
        <div className="mt-4">
          <ReviewedByBadge
            reviewer={article.reviewedBy.reviewer as never}
            reviewedAt={article.reviewedBy.reviewedAt}
          />
        </div>
      )}
      <div className="prose mt-10">
        <PortableTextRenderer value={article.body as never} />
      </div>
    </article>
  )
}
