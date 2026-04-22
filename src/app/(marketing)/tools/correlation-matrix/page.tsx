import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/seo/json-ld'
import { buildBreadcrumbList } from '@/seo/schemas/breadcrumb-list'
import { buildFaqPage } from '@/seo/schemas/faq-page'
import { CorrelationMatrixTool } from './CorrelationMatrixTool'

export const metadata: Metadata = {
  title: 'Asset Class Correlation Matrix',
  description:
    'What correlation is, how it works between stocks, bonds, and metals, and what history shows about gold and the stock market during periods of stress.',
  alternates: { canonical: '/tools/correlation-matrix' },
}

export const dynamic = 'force-dynamic'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
const url = `${siteUrl}/tools/correlation-matrix`

const faqs = [
  {
    question: 'What does correlation measure?',
    answer:
      'Correlation measures how two return series moved together over a selected sample window. It ranges from -1 to +1.',
  },
  {
    question: 'Can correlation change?',
    answer:
      'Yes. Correlation changes across markets, stress periods, interest-rate regimes, and liquidity conditions. Treat it as a measured relationship, not a permanent property.',
  },
]

export default function CorrelationMatrixPage() {
  return (
    <div className="px-6 py-10">
      <JsonLd
        data={buildBreadcrumbList({
          siteUrl,
          items: [
            { label: 'Home', path: '/' },
            { label: 'Tools', path: '/tools' },
            { label: 'Correlation Matrix', path: '/tools/correlation-matrix' },
          ],
        })}
      />
      <JsonLd data={buildFaqPage({ url, qas: faqs })} />
      <Breadcrumbs
        items={[
          { href: '/', label: 'Home' },
          { href: '/tools', label: 'Tools' },
          { label: 'Correlation Matrix' },
        ]}
      />
      <h1 className="mt-6 font-serif text-4xl font-bold">
        Asset Class Correlation Matrix
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-brand-slate">
        Compare how precious metals, equities, bonds, and cash moved in
        educational monthly-return samples. Use the matrix to frame allocation
        questions, not to predict future returns.
      </p>

      <section className="mt-10" aria-live="polite">
        <CorrelationMatrixTool />
      </section>

      <section className="mt-12 max-w-3xl space-y-4 text-sm text-brand-slate">
        <h2 className="font-serif text-2xl text-brand-navy">Methodology</h2>
        <p>
          The current implementation uses bundled monthly-return samples so the
          matrix is available without a market-data contract. Before production
          reliance, replace the bundled samples with a documented historical
          return source and publish the date range used for each series.
        </p>
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
