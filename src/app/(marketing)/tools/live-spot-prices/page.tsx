import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/seo/json-ld'
import { buildBreadcrumbList } from '@/seo/schemas/breadcrumb-list'
import { buildFaqPage } from '@/seo/schemas/faq-page'
import { HistorySection } from './HistorySection'
import { LiveSpotGrid } from './LiveSpotGrid'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Live Spot Prices',
  description:
    'Real-time spot prices for gold, silver, platinum, and palladium, sourced from institutional market feeds.',
  alternates: { canonical: '/tools/live-spot-prices' },
}

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
const url = `${siteUrl}/tools/live-spot-prices`

const faqs = [
  {
    question: 'Where do these spot prices come from?',
    answer:
      'Prices are sourced from MetalpriceAPI, which aggregates institutional feeds. Our server caches responses for 5 seconds and refreshes every 10 seconds on the client.',
  },
  {
    question: 'Why does a row say "cached"?',
    answer:
      'If the upstream provider is temporarily unavailable, we serve the last known good price with a cached marker until connectivity resumes.',
  },
]

export default function LiveSpotPricesPage() {
  return (
    <div className="px-6 py-10">
      <JsonLd
        data={buildBreadcrumbList({
          siteUrl,
          items: [
            { label: 'Home', path: '/' },
            { label: 'Tools', path: '/tools' },
            { label: 'Live Spot Prices', path: '/tools/live-spot-prices' },
          ],
        })}
      />
      <JsonLd data={buildFaqPage({ url, qas: faqs })} />
      <Breadcrumbs
        items={[
          { href: '/', label: 'Home' },
          { href: '/tools', label: 'Tools' },
          { label: 'Live Spot Prices' },
        ]}
      />
      <h1 className="mt-6 font-serif text-4xl font-bold">Live Spot Prices</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-charcoal">
        Institutional-grade spot prices for the four IRA-eligible precious
        metals, updated every 10 seconds. Use these figures as an independent
        reference when you evaluate your written estimate.
      </p>
      <section className="mt-10">
        <LiveSpotGrid />
      </section>
      <section className="mt-12">
        <HistorySection />
      </section>
      <section className="mt-12">
        <h2 className="font-serif text-2xl">FAQ</h2>
        <dl className="mt-4 space-y-4">
          {faqs.map((qa) => (
            <div key={qa.question}>
              <dt className="font-semibold">{qa.question}</dt>
              <dd className="mt-1 text-sm">{qa.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
