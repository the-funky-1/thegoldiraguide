import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Privacy and Analytics',
  description:
    'How The Gold IRA Guide uses analytics while keeping education separate from outbound sales activity.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <div className="px-6 py-10">
      <Breadcrumbs
        items={[{ href: '/', label: 'Home' }, { label: 'Privacy and Analytics' }]}
      />
      <article className="mx-auto mt-8 max-w-3xl">
        <h1 className="font-serif text-4xl font-bold">
          Privacy and Analytics
        </h1>
        <p className="mt-4 text-lg text-brand-slate">
          The Gold IRA Guide is an educational site owned and operated by Liberty
          Gold Silver. We use analytics to understand which educational pages,
          calculators, and comparison tools need improvement. We do not sell
          products on this site, and analytics activity is not used for outbound
          sales calls.
        </p>

        <section className="mt-10 space-y-4">
          <h2 className="font-serif text-2xl">Analytics services</h2>
          <p>
            The site may load Google Analytics, Vercel Analytics, and Amplitude
            Analytics when the corresponding deployment environment variables are
            configured. These tools report aggregate page activity, navigation,
            device and browser context, and interaction events for calculators
            and comparison tables.
          </p>
          <p>
            Financial inputs are bucketed before tracking. For example, a
            calculator amount may be recorded as a range such as 50k to 99k, not
            as the exact value entered. Names, emails, phone numbers, and written
            estimate request details must not be sent to analytics.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="font-serif text-2xl">How analytics is used</h2>
          <p>
            Analytics is used to improve page clarity, identify broken journeys,
            understand which tools are useful, and verify that important
            compliance disclosures remain visible. It is not a substitute for a
            signed written estimate, investment advice, tax advice, or legal
            advice.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="font-serif text-2xl">Analytics use</h2>
          <p>
            Analytics data collected on this site is used to improve editorial
            content — what readers look up, which pages need clarification,
            which tools see use. It is not used for outbound sales outreach.
          </p>
        </section>
      </article>
    </div>
  )
}
