import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { LinkButton } from '@/components/ui/link-button'
import { contrastRatio, passesAaa } from '@/design/contrast'
import {
  BRAND_COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from '@/design/tokens'

export const metadata: Metadata = {
  title: 'Design system',
  description:
    'Public reference for The Gold IRA Guide’s design tokens, typography, and components.',
  alternates: { canonical: '/about/design-system' },
}

export default function DesignSystemPage() {
  const canvas = BRAND_COLORS.canvas
  return (
    <div className="px-6 py-10">
      <Breadcrumbs
        items={[
          { href: '/', label: 'Home' },
          { href: '/about', label: 'Institutional Accountability' },
          { label: 'Design system' },
        ]}
      />
      <h1 className="mt-6 font-serif text-heading-xl">Design system</h1>
      <p className="mt-4 max-w-2xl text-body-lg text-fg-secondary">
        Every token below is the canonical source of truth for brand colors,
        type, spacing, and elevation. Components throughout the platform consume
        these tokens via Tailwind and the{' '}
        <code className="font-mono">src/design/tokens.ts</code> module.
      </p>

      <section className="mt-12">
        <h2 className="font-serif text-heading-lg">Colors</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(BRAND_COLORS).map(([key, hex]) => {
            const ratio = contrastRatio(hex, canvas)
            const ok = passesAaa(ratio, 'normal')
            return (
              <li
                key={key}
                className="rounded-md border border-border bg-bg-surface p-4"
              >
                <div
                  className="h-16 rounded-sm"
                  style={{ backgroundColor: hex }}
                />
                <dl className="mt-3 text-caption">
                  <dt className="font-semibold">{key}</dt>
                  <dd className="font-mono">{hex}</dd>
                  <dd>
                    Contrast vs canvas: {ratio}:1{' '}
                    <span
                      className={
                        ok ? 'text-feedback-success' : 'text-feedback-warning'
                      }
                    >
                      {ok ? 'AAA' : 'sub-AAA'}
                    </span>
                  </dd>
                </dl>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-heading-lg">Typography</h2>
        <ul className="mt-6 space-y-4">
          {Object.entries(TYPOGRAPHY).map(([key, t]) => (
            <li key={key} className="border-b border-border pb-4">
              <p
                style={{
                  fontFamily: t.fontFamily,
                  fontSize: t.fontSize,
                  lineHeight: t.lineHeight,
                  fontWeight: t.fontWeight,
                }}
              >
                {key} — The quick brown fox jumps over the lazy dog
              </p>
              <p className="mt-1 font-mono text-caption text-fg-secondary">
                {t.fontSize} / {t.lineHeight} / {t.fontWeight}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-heading-lg">Spacing</h2>
        <ul className="mt-6 space-y-2 font-mono text-caption">
          {Object.entries(SPACING).map(([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-heading-lg">Radius + shadow</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {Object.entries(RADIUS).map(([key, value]) => (
            <li key={key} className="p-4">
              <div
                className="h-12 w-full bg-brand-navy"
                style={{ borderRadius: value }}
              />
              <p className="mt-2 font-mono text-caption">
                radius-{key}: {value}
              </p>
            </li>
          ))}
          {Object.entries(SHADOW).map(([key, value]) => (
            <li key={key} className="p-4">
              <div
                className="h-12 w-full rounded-md bg-bg-surface"
                style={{ boxShadow: value }}
              />
              <p className="mt-2 font-mono text-caption">shadow-{key}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-heading-lg">Buttons</h2>
        <div className="mt-6 flex flex-wrap gap-4">
          <LinkButton href="#">Primary</LinkButton>
          <LinkButton href="#" intent="secondary">
            Secondary
          </LinkButton>
          <LinkButton href="#" intent="ghost">
            Ghost
          </LinkButton>
          <LinkButton href="#" size="lg">
            Large primary
          </LinkButton>
        </div>
      </section>
    </div>
  )
}
