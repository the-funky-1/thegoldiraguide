import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/seo/json-ld'
import { buildBreadcrumbList } from '@/seo/schemas/breadcrumb-list'
import { buildFaqPage } from '@/seo/schemas/faq-page'
import { RmdForm } from './RmdForm'
import { RmdResult } from './RmdResult'

export const metadata: Metadata = {
  title: 'Gold IRA Required Minimum Distribution Estimator',
  description:
    'RMD rules under SECURE 2.0 for a precious metals IRA. Age thresholds, in-kind distributions, and how the estimator tool works.',
  alternates: { canonical: '/tools/rmd-estimator' },
}

export const dynamic = 'force-dynamic'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thegoldiraguide.com'
const url = `${siteUrl}/tools/rmd-estimator`

const faqs = [
  {
    question: 'How is an RMD usually calculated?',
    answer:
      'For a standard IRA owner, the prior December 31 account value is divided by an IRS life expectancy factor for the owner age in the distribution year.',
  },
  {
    question: 'Does this estimator cover inherited IRAs?',
    answer:
      'No. Inherited IRA, spouse beneficiary, plan-specific, and tax penalty rules can differ. Use this estimator only as an educational starting point.',
  },
]

export default function RmdEstimatorPage() {
  return (
    <div className="px-6 py-10">
      <JsonLd
        data={buildBreadcrumbList({
          siteUrl,
          items: [
            { label: 'Home', path: '/' },
            { label: 'Tools', path: '/tools' },
            { label: 'RMD Estimator', path: '/tools/rmd-estimator' },
          ],
        })}
      />
      <JsonLd data={buildFaqPage({ url, qas: faqs })} />
      <Breadcrumbs
        items={[
          { href: '/', label: 'Home' },
          { href: '/tools', label: 'Tools' },
          { label: 'RMD Estimator' },
        ]}
      />
      <h1 className="mt-6 font-serif text-4xl font-bold">
        Gold IRA Required Minimum Distribution Estimator
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-brand-slate">
        Estimate the required minimum distribution for a non-inherited IRA using
        age, distribution year, prior year-end account value, and the IRS
        Uniform Lifetime Table.
      </p>

      <section className="mt-10">
        <RmdForm />
      </section>
      <section className="mt-10" aria-live="polite">
        <RmdResult />
      </section>

      <section className="mt-12 max-w-3xl space-y-4 text-sm text-brand-slate">
        <h2 className="font-serif text-2xl text-brand-navy">Source Notes</h2>
        <p>
          The IRS states that RMDs are generally calculated by dividing the prior
          December 31 balance by a life expectancy factor published in IRS
          tables. This estimator uses the Uniform Lifetime Table divisors
          effective for 2022 and later years.
        </p>
        <p>
          Sources:{' '}
          <a
            href="https://www.irs.gov/retirement-plans/retirement-plan-and-ira-required-minimum-distributions-faqs"
            className="underline underline-offset-2"
          >
            IRS RMD FAQs
          </a>{' '}
          and{' '}
          <a
            href="https://www.irs.gov/irb/2022-05_IRB/index.html"
            className="underline underline-offset-2"
          >
            IRS Uniform Lifetime Table
          </a>
          .
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
