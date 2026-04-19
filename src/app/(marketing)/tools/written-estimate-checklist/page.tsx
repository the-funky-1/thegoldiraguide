import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { dealerRowSchema, type DealerRow } from '@/finance/comparison/schema'
import { listFeeSchedules } from '@/sanity/fetchers'
import { JsonLd } from '@/seo/json-ld'
import { buildBreadcrumbList } from '@/seo/schemas/breadcrumb-list'
import { buildFaqPage } from '@/seo/schemas/faq-page'
import { ComparisonFilters } from './ComparisonFilters'
import { ComparisonTable } from './ComparisonTable'

export const metadata: Metadata = {
  title: 'Written Estimate Checklist',
  description:
    'The itemized standard our institution documents in every binding written estimate before a client commits capital.',
  alternates: { canonical: '/tools/written-estimate-checklist' },
}

// Dynamic render so the middleware-issued CSP nonce reaches hydrating chunks
// that power the client-side filter + sort controls.
export const dynamic = 'force-dynamic'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
const url = `${siteUrl}/tools/written-estimate-checklist`

const faqs = [
  {
    question: 'What appears in our written estimate?',
    answer:
      'Every one-time setup fee, annual admin fee, storage model (flat or scaling), purchase spread, liquidation spread, and minimum investment — itemized in writing, verified against source documents, and binding before any capital moves.',
  },
  {
    question: 'Why is the purchase spread shown first?',
    answer:
      'The purchase spread is the single largest line item in the lifecycle cost of a precious metals IRA. Documenting it in writing up front is the mathematical foundation of our accountability standard.',
  },
]

export default async function WrittenEstimateChecklistPage() {
  const raw = await listFeeSchedules<Record<string, unknown>>()
  const parsed: DealerRow[] = raw.flatMap((r) => {
    const result = dealerRowSchema.safeParse(r)
    return result.success ? [result.data] : []
  })

  return (
    <div className="px-6 py-10">
      <JsonLd
        data={buildBreadcrumbList({
          siteUrl,
          items: [
            { label: 'Home', path: '/' },
            { label: 'Tools', path: '/tools' },
            {
              label: 'Written Estimate Checklist',
              path: '/tools/written-estimate-checklist',
            },
          ],
        })}
      />
      <JsonLd data={buildFaqPage({ url, qas: faqs })} />
      <Breadcrumbs
        items={[
          { href: '/', label: 'Home' },
          { href: '/tools', label: 'Tools' },
          { label: 'Written Estimate Checklist' },
        ]}
      />
      <h1 className="mt-6 font-serif text-4xl font-bold">
        Written Estimate Checklist
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-charcoal">
        Every line item our institution documents in writing before a client
        commits capital. Review it at your own pace. Each value is verified
        against a source document and is binding upon issuance of your written
        estimate.
      </p>

      <section className="mt-10">
        <ComparisonFilters />
      </section>
      <section className="mt-6 overflow-x-auto">
        <ComparisonTable dealers={parsed} />
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
