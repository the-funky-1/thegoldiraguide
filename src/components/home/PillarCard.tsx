import Link from 'next/link'
import { pillarHref, type Pillar } from '@/lib/site-map'

export function PillarCard({ pillar }: { pillar: Pillar }) {
  return (
    <Link
      href={pillarHref(pillar.slug)}
      className="block h-full rounded-lg border border-brand-slate/20 bg-bg-surface p-6 shadow-sm transition-shadow hover:border-brand-gold hover:shadow-md"
    >
      <p
        data-testid="pillar-eyebrow"
        className="text-xs font-semibold uppercase tracking-wider text-brand-navy"
      >
        {pillar.shortLabel}
      </p>
      <h3 className="mt-3 font-serif text-xl font-semibold text-brand-navy">
        {pillar.label}
      </h3>
      <p className="mt-2 text-sm text-brand-slate">{pillar.summary}</p>
    </Link>
  )
}
