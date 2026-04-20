import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/seo/json-ld'
import { buildBreadcrumbList } from '@/seo/schemas/breadcrumb-list'
import { buildFaqPage } from '@/seo/schemas/faq-page'
import { FeeDragForm } from './FeeDragForm'
import { FeeDragResult } from './FeeDragResult'

export const metadata: Metadata = {
  title: 'Fee Drag Analyzer',
  description:
    'Project how flat-rate vs. percentage-based fee structures erode a precious metals IRA over time.',
  alternates: { canonical: '/tools/fee-drag-analyzer' },
}

// Dynamic render so the middleware-issued CSP nonce is applied to hydrating
// client chunks on every request. Static prerender would freeze a stale nonce
// into the HTML and break the calculator's client-side interactivity.
export const dynamic = 'force-dynamic'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
const url = `${siteUrl}/tools/fee-drag-analyzer`

const faqs = [
  {
    question: 'How is fee drag calculated?',
    answer:
      'Each year: balance grows by the annual return, then the applicable annual fee is deducted. For scaling fees, the storage percentage is applied to the post-growth balance.',
  },
  {
    question: 'Why does the scaling model underperform the flat model?',
    answer:
      'Scaling fees grow with the portfolio, compounding their drag. A flat fee stays fixed even as the balance grows, so its proportional cost shrinks over time.',
  },
]

export default function FeeDragAnalyzerPage() {
  return (
    <div className="px-6 py-10">
      <JsonLd
        data={buildBreadcrumbList({
          siteUrl,
          items: [
            { label: 'Home', path: '/' },
            { label: 'Tools', path: '/tools' },
            { label: 'Fee Drag Analyzer', path: '/tools/fee-drag-analyzer' },
          ],
        })}
      />
      <JsonLd data={buildFaqPage({ url, qas: faqs })} />
      <Breadcrumbs
        items={[
          { href: '/', label: 'Home' },
          { href: '/tools', label: 'Tools' },
          { label: 'Fee Drag Analyzer' },
        ]}
      />
      <h1 className="mt-6 font-serif text-4xl font-bold">Fee Drag Analyzer</h1>
      <p className="mt-4 max-w-2xl text-lg text-brand-slate">
        Project how a flat-rate versus percentage-based storage fee structure
        erodes a precious metals IRA over time. All calculations use
        exact-decimal arithmetic.
      </p>

      <section className="mt-10">
        <FeeDragForm />
      </section>
      <section className="mt-10" aria-live="polite">
        <FeeDragResult />
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
