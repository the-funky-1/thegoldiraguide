type CitationEntry = { label: string; url: string; accessed: string }

export const CITATIONS: Record<string, CitationEntry> = {
  'irs-590a': {
    label: 'IRS Publication 590-A (Contributions to IRAs)',
    url: 'https://www.irs.gov/pub/irs-pdf/p590a.pdf',
    accessed: '2026-04-19',
  },
  'irs-590b': {
    label: 'IRS Publication 590-B (Distributions from IRAs)',
    url: 'https://www.irs.gov/pub/irs-pdf/p590b.pdf',
    accessed: '2026-04-19',
  },
  'irc-408m': {
    label: 'Internal Revenue Code § 408(m)',
    url: 'https://www.law.cornell.edu/uscode/text/26/408',
    accessed: '2026-04-19',
  },
  'usc-31-5112': {
    label:
      '31 U.S.C. § 5112 (Denominations, specifications, and design of coins)',
    url: 'https://www.law.cornell.edu/uscode/text/31/5112',
    accessed: '2026-04-19',
  },
  'secure-2': {
    label: 'SECURE 2.0 Act (Pub. L. 117-328, Div. T)',
    url: 'https://www.congress.gov/bill/117th-congress/house-bill/2617',
    accessed: '2026-04-19',
  },
  'finra-metals': {
    label: 'FINRA Investor Bulletin: Buying Physical Gold or Other Metals',
    url: 'https://www.finra.org/investors/insights/buying-physical-gold-or-other-metals',
    accessed: '2026-04-19',
  },
  'ftc-endorsement-guides': {
    label: 'FTC Endorsement Guides (16 CFR Part 255)',
    url: 'https://www.ftc.gov/legal-library/browse/rules/guides-concerning-use-endorsements-testimonials-advertising',
    accessed: '2026-04-19',
  },
}

export function citation(key: string): CitationEntry {
  const entry = CITATIONS[key]
  if (!entry) throw new Error(`citation: unknown key "${key}"`)
  return entry
}
