import Link from 'next/link'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { articleHref, pillarBySlug, type PillarSlug } from '@/lib/site-map'
import { formatLongDate } from '@/lib/date'

type ArticleCard = {
  _id: string
  title: string
  slug: string
  summary?: string
  publishedAt: string
  updatedAt: string
}

export function PillarIndexPage({
  pillarSlug,
  articles,
}: {
  pillarSlug: PillarSlug
  articles: ArticleCard[]
}) {
  const pillar = pillarBySlug(pillarSlug)
  if (!pillar) return null

  return (
    <div className="px-6 py-10">
      <Breadcrumbs
        items={[{ href: '/', label: 'Home' }, { label: pillar.label }]}
      />
      <h1 className="mt-6 font-serif text-4xl font-bold">{pillar.label}</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-charcoal">
        {pillar.summary}
      </p>

      {articles.length === 0 ? (
        <p className="mt-10 text-slate-charcoal">No articles published yet.</p>
      ) : (
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {articles.map((a) => (
            <li
              key={a._id}
              className="rounded-lg border border-slate-charcoal/20 bg-white p-6"
            >
              <h2 className="font-serif text-xl">
                <Link
                  href={articleHref(pillarSlug, a.slug)}
                  className="underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-old-gold"
                >
                  {a.title}
                </Link>
              </h2>
              {a.summary && (
                <p className="mt-2 text-sm text-slate-charcoal">{a.summary}</p>
              )}
              <p className="mt-3 text-xs text-slate-charcoal">
                Updated {formatLongDate(a.updatedAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
