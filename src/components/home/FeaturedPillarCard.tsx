import Link from 'next/link'
import { pillarHref, type Pillar } from '@/lib/site-map'

export function FeaturedPillarCard({ pillar }: { pillar: Pillar }) {
  return (
    <article className="flex h-full flex-col justify-between rounded-lg border border-brand-slate/20 bg-brand-navy p-8 text-brand-platinum shadow-md">
      <div>
        <p
          data-testid="featured-eyebrow"
          className="text-xs font-semibold uppercase tracking-wider text-brand-gold"
        >
          Featured · Start here
        </p>
        <h2 className="mt-4 font-serif text-3xl font-bold text-brand-platinum">
          {pillar.label}
        </h2>
        <p className="mt-4 max-w-xl text-base text-brand-platinum/80">
          {pillar.summary}
        </p>
      </div>
      <Link
        href={pillarHref(pillar.slug)}
        className="mt-6 inline-flex items-baseline gap-2 text-sm font-semibold text-brand-gold underline underline-offset-4 hover:text-brand-platinum"
      >
        Start here<span aria-hidden="true">→</span>
      </Link>
    </article>
  )
}
