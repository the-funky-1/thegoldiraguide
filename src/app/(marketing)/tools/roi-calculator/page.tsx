import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/seo/json-ld'
import { buildBreadcrumbList } from '@/seo/schemas/breadcrumb-list'
import { buildFaqPage } from '@/seo/schemas/faq-page'
import { RoiForm } from './RoiForm'
import { RoiResult } from './RoiResult'

export const metadata: Metadata = {
  title: 'ROI Calculator',
  description:
    'Model net return on a precious metals IRA after purchase spreads, liquidation spreads, and annual fees.',
  alternates: { canonical: '/tools/roi-calculator' },
}

// Dynamic render so the middleware-issued CSP nonce reaches hydrating chunks.
export const dynamic = 'force-dynamic'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
const url = `${siteUrl}/tools/roi-calculator`

const faqs = [
  {
    question: 'What counts as a realistic annual appreciation figure?',
    answer:
      'Long-run gold price appreciation is around 3–6% nominal, but annual values are volatile. Use a conservative figure when stress-testing; the calculator is designed to reveal how spreads and fees swamp a thin return assumption.',
  },
  {
    question: 'Why do spreads hurt me both at purchase and liquidation?',
    answer:
      'A dealer buys metal at one price and sells to you at another; that gap is the purchase spread. At exit, the dealer buys your metal back at a lower price than it sells for, which is the liquidation spread. You pay both sides of the transaction.',
  },
  {
    question: 'How does this compare to holding an ETF?',
    answer:
      'An ETF like GLD has a small expense ratio (≈0.40%) and tight bid/ask spreads — usually well under 1%. A physical precious metals IRA adds purchase + liquidation spreads and fixed custodial/storage fees. Run both scenarios to see when the tax advantages of an IRA offset the higher friction.',
  },
]

export default function RoiCalculatorPage() {
  return (
    <div className="px-6 py-10">
      <JsonLd
        data={buildBreadcrumbList({
          siteUrl,
          items: [
            { label: 'Home', path: '/' },
            { label: 'Tools', path: '/tools' },
            { label: 'ROI Calculator', path: '/tools/roi-calculator' },
          ],
        })}
      />
      <JsonLd data={buildFaqPage({ url, qas: faqs })} />
      <Breadcrumbs
        items={[
          { href: '/', label: 'Home' },
          { href: '/tools', label: 'Tools' },
          { label: 'ROI Calculator' },
        ]}
      />
      <h1 className="mt-6 font-serif text-4xl font-bold">ROI Calculator</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-charcoal">
        Model net return after purchase spread, liquidation spread, and annual
        fees. Every figure uses exact-decimal arithmetic. If your projected fee
        burden exceeds 20% of principal, you will be asked to type the figure to
        continue — a deliberate friction we apply to high-cost projections.
      </p>

      <section className="mt-10">
        <RoiForm />
      </section>
      <section className="mt-10" aria-live="polite">
        <RoiResult />
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
