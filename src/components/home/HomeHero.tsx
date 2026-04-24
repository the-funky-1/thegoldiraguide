import Link from 'next/link'
import { OwnershipLockup } from '@/components/brand/OwnershipLockup'
import { pillarBySlug, pillarHref } from '@/lib/site-map'
import { HeroBackdrop } from './HeroBackdrop'
import { MarketPulseCard } from './MarketPulseCard'
import { FEATURED_PILLAR_SLUG } from './home-config'

export function HomeHero() {
  const featured = pillarBySlug(FEATURED_PILLAR_SLUG)
  const featuredLabel = featured?.shortLabel ?? 'IRA Rules'
  const featuredHref = featured ? pillarHref(featured.slug) : '/ira-rules'

  return (
    <section className="relative overflow-hidden border-b border-brand-slate/20 bg-bg-canvas">
      <HeroBackdrop />
      <div className="relative mx-auto grid max-w-screen-xl gap-10 px-6 py-20 lg:grid-cols-[3fr_2fr] lg:items-center lg:py-24">
        <div>
          <p
            data-testid="hero-eyebrow"
            className="text-xs font-semibold uppercase tracking-wider text-brand-gold"
          >
            Independent reference · Updated weekly
          </p>
          <h1 className="mt-4 font-serif text-display-xl text-brand-navy">
            The Gold IRA Guide
          </h1>
          <p
            data-testid="home-subtitle"
            className="mt-6 max-w-xl text-body-lg text-brand-slate"
          >
            An independent reference on self-directed precious metals IRAs —
            the rules, the costs, and the numbers that move them.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={featuredHref}
              className="inline-flex items-center gap-2 rounded-md bg-brand-navy px-5 py-3 text-sm font-semibold text-brand-platinum hover:bg-brand-navy/90"
            >
              Start with {featuredLabel}
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/tools/live-spot-prices"
              className="inline-flex items-center gap-2 rounded-md border border-brand-slate/30 bg-bg-surface px-5 py-3 text-sm font-semibold text-brand-navy hover:border-brand-gold"
            >
              See live spot prices
            </Link>
          </div>
          <div className="mt-10">
            <OwnershipLockup tone="light" />
          </div>
        </div>
        <div className="lg:justify-self-end lg:self-center">
          <MarketPulseCard />
        </div>
      </div>
    </section>
  )
}
