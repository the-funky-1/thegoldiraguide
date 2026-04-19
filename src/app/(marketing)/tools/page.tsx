import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { pillarBySlug } from '@/lib/site-map'

const pillar = pillarBySlug('tools')!

export const metadata: Metadata = {
  title: pillar.label,
  description: pillar.summary,
  alternates: { canonical: '/tools' },
}

const tools = [
  {
    slug: 'fee-drag-analyzer',
    title: 'Fee Drag Analyzer',
    status: 'Coming in Plan 5',
  },
  {
    slug: 'roi-calculator',
    title: 'ROI Calculator',
    status: 'Coming in Plan 5',
  },
  {
    slug: 'live-spot-prices',
    title: 'Live Spot Prices',
    status: 'Coming in Plan 6',
  },
  {
    slug: 'written-estimate-checklist',
    title: 'Written Estimate Checklist',
    status: 'Coming in Plan 5',
  },
]

export default function ToolsLanding() {
  return (
    <div className="px-6 py-10">
      <Breadcrumbs
        items={[{ href: '/', label: 'Home' }, { label: pillar.label }]}
      />
      <h1 className="mt-6 font-serif text-4xl font-bold">{pillar.label}</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-charcoal">
        {pillar.summary}
      </p>
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {tools.map((t) => (
          <li
            key={t.slug}
            className="rounded-lg border border-slate-charcoal/20 bg-white p-6"
          >
            <h2 className="font-serif text-xl">{t.title}</h2>
            <p className="mt-2 text-sm text-slate-charcoal">{t.status}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
