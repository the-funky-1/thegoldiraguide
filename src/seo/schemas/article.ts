import type { Article, Person, WithContext } from 'schema-dts'
import type { PillarSlug } from '@/lib/site-map'

type Input = {
  siteUrl: string
  pillarSlug: PillarSlug
  slug: string
  title: string
  summary?: string
  publishedAt: string
  updatedAt: string
  author: { name: string; slug: string }
  reviewer: { name: string; slug: string } | null
  citations?: ReadonlyArray<{ label: string; url: string }>
}

type ConcretePerson = Exclude<Person, string>

// schema-dts narrows `reviewedBy` to WebPage, but Google Search recognizes it
// on Article as well. Extend the Article contract with the property we emit.
type ArticleWithReview = Exclude<Article, string> & {
  reviewedBy?: ConcretePerson
  citation?: Array<{ '@type': 'CreativeWork'; name: string; url: string }>
}

function personRef(
  siteUrl: string,
  p: { name: string; slug: string },
): ConcretePerson {
  return {
    '@type': 'Person',
    name: p.name,
    url: `${siteUrl}/about/expert-authors/${p.slug}`,
  }
}

export function buildArticle(input: Input): WithContext<ArticleWithReview> {
  const out: WithContext<ArticleWithReview> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    url: `${input.siteUrl}/${input.pillarSlug}/${input.slug}`,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt,
    author: personRef(input.siteUrl, input.author),
    publisher: {
      '@type': 'Organization',
      name: 'The Gold IRA Guide',
      url: input.siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${input.siteUrl}/${input.pillarSlug}/${input.slug}`,
    },
  }
  if (input.summary) {
    out.description = input.summary
  }
  if (input.reviewer) {
    out.reviewedBy = personRef(input.siteUrl, input.reviewer)
  }
  if (input.citations && input.citations.length > 0) {
    out.citation = input.citations.map((c) => ({
      '@type': 'CreativeWork' as const,
      name: c.label,
      url: c.url,
    }))
  }
  return out
}
