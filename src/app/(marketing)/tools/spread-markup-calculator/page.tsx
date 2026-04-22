import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/seo/json-ld'
import { buildBreadcrumbList } from '@/seo/schemas/breadcrumb-list'
import { buildFaqPage } from '@/seo/schemas/faq-page'
import { SpreadMarkupForm } from './SpreadMarkupForm'
import { SpreadMarkupResult } from './SpreadMarkupResult'

export const metadata: Metadata = {
  title: 'Dealer Spread and Markup Calculator',
  description:
    'Calculate the markup above spot on a dealer quote for a physical metal product. Follow the step-by-step procedure and worked example.',
  alternates: { canonical: '/tools/spread-markup-calculator' },
}

export const dynamic = 'force-dynamic'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
const url = `${siteUrl}/tools/spread-markup-calculator`

const faqs = [
  {
    question: 'What does markup above spot mean?',
    answer:
      'Markup above spot is the quoted transaction value minus the intrinsic metal value calculated from spot price, product ounces, and quantity.',
  },
  {
    question: 'Why does the written estimate matter?',
    answer:
      'A written estimate ties the quoted product, quantity, spread, fixed fees, storage model, and expiration terms to one documented transaction before capital moves.',
  },
]

export default function SpreadMarkupCalculatorPage() {
  return (
    <div className="px-6 py-10">
      <JsonLd
        data={buildBreadcrumbList({
          siteUrl,
          items: [
            { label: 'Home', path: '/' },
            { label: 'Tools', path: '/tools' },
            {
              label: 'Dealer Spread and Markup Calculator',
              path: '/tools/spread-markup-calculator',
            },
          ],
        })}
      />
      <JsonLd data={buildFaqPage({ url, qas: faqs })} />
      <Breadcrumbs
        items={[
          { href: '/', label: 'Home' },
          { href: '/tools', label: 'Tools' },
          { label: 'Dealer Spread and Markup Calculator' },
        ]}
      />
      <h1 className="mt-6 font-serif text-4xl font-bold">
        Dealer Spread and Markup Calculator
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-brand-slate">
        Compare a quoted product price against spot value. The calculation shows
        the dollar markup, markup percentage, and markup per ounce so the figure
        can be documented in writing.
      </p>

      <section className="mt-10">
        <SpreadMarkupForm />
      </section>
      <section className="mt-10" aria-live="polite">
        <SpreadMarkupResult />
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
