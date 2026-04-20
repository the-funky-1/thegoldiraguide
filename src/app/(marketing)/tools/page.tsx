import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { pillarBySlug } from '@/lib/site-map'

const pillar = pillarBySlug('tools')!

export const metadata: Metadata = {
  title: pillar.label,
  description: pillar.summary,
  alternates: { canonical: '/tools' },
}

type Tool = {
  slug: string
  title: string
  description: string
  disabled?: boolean
}

const tools: Tool[] = [
  {
    slug: 'fee-drag-analyzer',
    title: 'Fee Drag Analyzer',
    description: 'Project flat vs. scaling fee drag over decades.',
  },
  {
    slug: 'roi-calculator',
    title: 'ROI Calculator',
    description: 'Model net returns after spreads and fees.',
  },
  {
    slug: 'written-estimate-checklist',
    title: 'Written Estimate Checklist',
    description:
      'The itemized standard documented in every binding written estimate we issue.',
  },
  {
    slug: 'live-spot-prices',
    title: 'Live Spot Prices',
    description:
      'Real-time gold, silver, platinum, and palladium spot prices with 10s refresh.',
  },
]

export default function ToolsLanding() {
  return (
    <div className="px-6 py-10">
      <Breadcrumbs
        items={[{ href: '/', label: 'Home' }, { label: pillar.label }]}
      />
      <h1 className="mt-6 font-serif text-4xl font-bold">{pillar.label}</h1>
      <p className="mt-4 max-w-2xl text-lg text-brand-slate">
        {pillar.summary}
      </p>
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {tools.map((t) => (
          <li
            key={t.slug}
            className="rounded-lg border border-brand-slate/20 bg-white p-6"
          >
            <h2 className="font-serif text-xl">
              {t.disabled ? (
                <span className="text-brand-slate">{t.title}</span>
              ) : (
                <Link
                  href={`/tools/${t.slug}`}
                  className="underline underline-offset-2"
                >
                  {t.title}
                </Link>
              )}
            </h2>
            <p className="mt-2 text-sm text-brand-slate">{t.description}</p>
            {t.disabled && (
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-brand-slate">
                Unavailable
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
