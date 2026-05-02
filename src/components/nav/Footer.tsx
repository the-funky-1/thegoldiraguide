import Link from 'next/link'
import Image from 'next/image'
import { OwnershipLockup } from '@/components/brand/OwnershipLockup'
import { PILLARS, pillarHref } from '@/lib/site-map'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer
      role="contentinfo"
      className="mt-16 border-t border-brand-slate/20 bg-brand-navy text-brand-platinum"
    >
      <div className="mx-auto grid max-w-screen-xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="The Gold IRA Guide Logo" width={32} height={32} className="object-contain" />
            <p className="font-serif text-lg">The Gold IRA Guide</p>
          </div>
          <p className="mt-2 text-sm text-brand-platinum/80">
            Educational content only; not financial advice.
          </p>
          <div className="mt-4">
            <OwnershipLockup tone="dark" />
          </div>
        </div>
        <nav aria-label="Footer pillars">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-gold">
            Pillars
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {PILLARS.map((p) => (
              <li key={p.slug}>
                <Link
                  href={pillarHref(p.slug)}
                  className="underline underline-offset-2 hover:text-brand-gold"
                >
                  {p.shortLabel}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Accountability">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-gold">
            Accountability
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/about/liberty-gold-silver"
                className="underline underline-offset-2"
              >
                Liberty Gold Silver
              </Link>
            </li>
            <li>
              <Link
                href="/about/editorial-guidelines"
                className="underline underline-offset-2"
              >
                Editorial guidelines
              </Link>
            </li>
            <li>
              <Link
                href="/about/ftc-disclosure"
                className="underline underline-offset-2"
              >
                FTC disclosure
              </Link>
            </li>
            <li>
              <Link
                href="/about/expert-authors"
                className="underline underline-offset-2"
              >
                Expert authors
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="underline underline-offset-2">
                Privacy and analytics
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-gold">
            Data sources
          </h2>
          <p className="mt-3 text-sm text-brand-platinum/80">
            Spot prices and fee schedules are sourced from institutional feeds;
            see each page&apos;s last-verified timestamp.
          </p>
        </div>
      </div>
      <div className="border-t border-brand-platinum/20 py-4 text-center text-xs text-brand-platinum/70">
        © {year} Liberty Gold Silver. All rights reserved.
      </div>
    </footer>
  )
}
