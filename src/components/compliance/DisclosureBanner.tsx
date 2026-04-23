import Link from 'next/link'

// DO NOT modify the disclosure copy without review from legal/compliance.
// This component satisfies FTC 16 CFR Part 255 by disclosing the material
// connection between The Gold IRA Guide and Liberty Gold Silver in plain
// English. The compliance-as-code guard in `scripts/check-disclosure.ts`
// verifies this component is present and visible in `src/app/layout.tsx`.
export function DisclosureBanner() {
  return (
    <aside
      role="region"
      aria-label="FTC disclosure"
      className="w-full border-t border-brand-slate/20 bg-brand-navy text-brand-platinum"
    >
      <div className="mx-auto max-w-screen-xl px-6 py-4 text-sm leading-relaxed">
        <strong className="block font-semibold uppercase tracking-wide">
          FTC Disclosure
        </strong>
        <p className="mt-1">
          The Gold IRA Guide is an educational resource owned by Liberty Gold
          Silver, a precious metals dealer. No products are sold on this site.
          See our{' '}
          <Link
            href="/about/ftc-disclosure"
            className="underline underline-offset-2 hover:text-brand-gold"
          >
            full disclosure
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-brand-gold"
          >
            privacy policy
          </Link>
          .
        </p>
      </div>
    </aside>
  )
}
