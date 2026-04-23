import type { PillarSlug } from '@/content/strategic/types'

export type { PillarSlug }

export type Pillar = {
  slug: PillarSlug
  label: string
  shortLabel: string
  summary: string
  order: number
}

export const PILLARS: readonly Pillar[] = [
  {
    slug: 'ira-rules',
    label: 'IRA Rules',
    shortLabel: 'IRA Rules',
    summary:
      'IRS compliance, eligible metals, purity standards, and storage requirements for self-directed precious metals IRAs.',
    order: 1,
  },
  {
    slug: 'accountability',
    label: 'Written Accountability',
    shortLabel: 'Accountability',
    summary:
      'Written estimates, fee disclosures, and how to verify what a dealer promises before you move money.',
    order: 2,
  },
  {
    slug: 'economics',
    label: 'Precious Metals Economics',
    shortLabel: 'Economics',
    summary:
      'Macroeconomic rationale, supply and demand, paper vs. physical, and tax implications.',
    order: 3,
  },
  {
    slug: 'tools',
    label: 'Interactive Tools',
    shortLabel: 'Tools',
    summary:
      'Fee drag, ROI, spread markup, RMD, correlation, live spot price, and written-estimate tools.',
    order: 4,
  },
  {
    slug: 'about',
    label: 'About',
    shortLabel: 'About',
    summary:
      'Editorial guidelines, expert author biographies, FTC disclosure, and the ownership relationship with Liberty Gold Silver.',
    order: 5,
  },
] as const

const bySlug = new Map(PILLARS.map((p) => [p.slug, p]))

export function pillarBySlug(slug: string): Pillar | undefined {
  return bySlug.get(slug as PillarSlug)
}

export function pillarLabel(slug: PillarSlug): string {
  return bySlug.get(slug)?.label ?? ''
}

export function pillarHref(slug: PillarSlug): string {
  return `/${slug}`
}

export function articleHref(pillar: PillarSlug, articleSlug: string): string {
  return `/${pillar}/${articleSlug}`
}
