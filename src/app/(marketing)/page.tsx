import Link from 'next/link'
import { OwnershipLockup } from '@/components/brand/OwnershipLockup'
import { PILLARS, pillarHref } from '@/lib/site-map'

export default function HomePage() {
  return (
    <div className="px-6 py-12">
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="font-serif text-5xl font-bold tracking-tight">
          The Gold IRA Guide
        </h1>
        <p
          data-testid="home-subtitle"
          className="mt-6 text-lg text-brand-slate"
        >
          An independent reference on self-directed precious metals IRAs — the
          rules, the costs, and the numbers that move them.
        </p>
        <div className="mt-8 flex justify-center">
          <OwnershipLockup tone="light" />
        </div>
      </section>
      <section className="mx-auto mt-16 grid max-w-screen-xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((p) => (
          <Link
            key={p.slug}
            href={pillarHref(p.slug)}
            className="block rounded-lg border border-brand-slate/20 bg-white p-6 hover:border-brand-gold"
          >
            <h2 className="font-serif text-xl font-semibold">{p.label}</h2>
            <p className="mt-2 text-sm text-brand-slate">{p.summary}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}
