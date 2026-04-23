import type { Metadata } from 'next'
import Link from 'next/link'
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
          This page describes how The Gold IRA Guide uses analytics. Analytics
          data tells us which pages, calculators, and comparison tools readers
          find useful or confusing so we can improve them. No products are sold
          on this site, and analytics data is not used for outbound sales calls.
          For the material-connection disclosure between this site and its owner
          Liberty Gold Silver, see the{' '}
          <Link href="/about/ftc-disclosure" className="underline underline-offset-2">
            full FTC disclosure
          </Link>
          .
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
