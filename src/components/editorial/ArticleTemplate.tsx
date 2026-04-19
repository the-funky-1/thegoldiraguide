import { ArticleByline } from './ArticleByline'
import { PortableTextRenderer } from './PortableTextRenderer'
import { ReviewedByBadge } from './ReviewedByBadge'
import { TableOfContents } from './TableOfContents'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { pillarHref, pillarLabel, type PillarSlug } from '@/lib/site-map'

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

export function ArticleTemplate({
  pillarSlug,
  article,
}: {
  pillarSlug: PillarSlug
  article: Article
}) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-10">
      <Breadcrumbs
        items={[
          { href: '/', label: 'Home' },
          { href: pillarHref(pillarSlug), label: pillarLabel(pillarSlug) },
          { label: article.title },
        ]}
      />
      <h1 className="mt-6 font-serif text-4xl font-bold tracking-tight">
        {article.title}
      </h1>
      {article.summary && (
        <p className="mt-4 text-lg text-slate-charcoal">{article.summary}</p>
      )}
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
      <aside className="my-8 md:float-right md:ml-8 md:w-64">
        <TableOfContents blocks={article.body as never} />
      </aside>
      <div className="prose max-w-none">
        <PortableTextRenderer value={article.body as never} />
      </div>
    </article>
  )
}
