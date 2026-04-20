// DO NOT modify the disclosure copy without review from legal/compliance.
// This component satisfies FTC 16 CFR Part 255 and the brand's defensive
// marketing mandate. The compliance-as-code guard in
// `scripts/check-disclosure.ts` verifies this component is present in
// `src/app/layout.tsx`.
export function DisclosureBanner() {
  return (
    <aside
      role="region"
      aria-label="FTC disclosure"
      className="w-full bg-brand-navy text-brand-platinum"
    >
      <div className="mx-auto max-w-screen-xl px-6 py-4 text-sm leading-relaxed">
        <strong className="block font-semibold uppercase tracking-wide">
          FTC Disclosure
        </strong>
        <p className="mt-1">
          The Gold IRA Guide is a branded educational resource wholly owned and
          operated by Liberty Gold Silver. We do not sell products on this site,
          and we do not capture your data for outbound sales calls. Our
          institutional standard is accountability: every cost, fee, and
          transaction parameter is documented in a binding written estimate
          before a client commits capital.
        </p>
      </div>
    </aside>
  )
}
