import Link from 'next/link'
import { PILLARS, pillarHref } from '@/lib/site-map'

export function PillarNavigationMenu() {
  return (
    <nav aria-label="Primary" className="hidden md:block">
      <ul className="flex gap-6 text-sm font-medium">
        {PILLARS.map((p) => (
          <li key={p.slug}>
            <Link
              href={pillarHref(p.slug)}
              className="inline-flex min-h-touch items-center px-2 py-2 hover:text-brand-gold"
            >
              {p.shortLabel}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
