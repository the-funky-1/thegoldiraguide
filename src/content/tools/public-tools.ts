export type PublicToolPage = {
  slug: string
  title: string
  summary: string
  updatedAt: string
  markdown: string
}

export const PUBLIC_TOOL_PAGES: readonly PublicToolPage[] = [
  {
    slug: 'fee-drag-analyzer',
    title: 'Fee Drag Analyzer',
    summary:
      'Project how flat-rate and percentage-based storage fee structures affect a precious metals IRA over time.',
    updatedAt: '2026-04-22',
    markdown: [
      '## Formula',
      'Each year, the balance grows by the selected annual return, then the documented annual fees are deducted. The scaling scenario applies storage percentage fees to the post-growth balance.',
      '',
      '## Inputs',
      '- Starting balance',
      '- Horizon in years',
      '- Annual return assumption',
      '- One-time setup fee',
      '- Flat annual admin and storage fees',
      '- Scaling annual admin fee and storage percentage',
      '',
      '## Output',
      'The tool compares ending balances, total fees paid, and the dollar advantage of a flat-rate fee structure over the selected horizon.',
      '',
      '## Limitation',
      'The output is educational modeling only. It is not investment, tax, or legal advice.',
    ].join('\n'),
  },
  {
    slug: 'roi-calculator',
    title: 'ROI Calculator',
    summary:
      'Model net precious metals IRA return after purchase spread, liquidation spread, annual fees, and appreciation assumptions.',
    updatedAt: '2026-04-22',
    markdown: [
      '## Formula',
      'The calculator deducts the purchase spread up front, compounds the remaining value by the selected annual appreciation rate, deducts annual fees each year, then applies the liquidation spread at exit.',
      '',
      '## Inputs',
      '- Principal',
      '- Horizon in years',
      '- Annual appreciation assumption',
      '- Purchase spread',
      '- Liquidation spread',
      '- Annual fees',
      '',
      '## Output',
      'The tool reports net starting position, gross terminal value before friction, net terminal value after friction, net gain, net CAGR, and total fees paid.',
      '',
      '## Limitation',
      'The output is a scenario model. It does not forecast future precious metals prices.',
    ].join('\n'),
  },
  {
    slug: 'live-spot-prices',
    title: 'Live Spot Prices',
    summary:
      'Display gold, silver, platinum, and palladium spot prices with stale-state handling and source timestamps.',
    updatedAt: '2026-04-22',
    markdown: [
      '## Data Source',
      'Spot prices are fetched server-side from MetalpriceAPI and normalized to USD per troy ounce for gold, silver, platinum, and palladium.',
      '',
      '## Refresh Model',
      'The client refreshes spot quotes every 10 seconds. If the upstream provider is unavailable, the page can display the last known good value with a stale marker.',
      '',
      '## Limitation',
      'Spot prices are reference data for education and verification. Transaction prices, spreads, storage costs, and dealer terms must be documented separately in writing.',
    ].join('\n'),
  },
  {
    slug: 'written-estimate-checklist',
    title: 'Written Estimate Checklist',
    summary:
      'Review the line items that should be documented before capital moves into a precious metals IRA transaction.',
    updatedAt: '2026-04-22',
    markdown: [
      '## Accountability Standard',
      'Every setup fee, annual admin fee, storage model, purchase spread, liquidation spread, minimum investment, and material condition should be documented in a written estimate before you commit to a dealer.',
      '',
      '## Comparison Method',
      'The page filters and sorts source-backed fee schedule rows so readers can compare documented terms at their own pace.',
      '',
      '## Limitation',
      'A comparison table is not a substitute for a signed written estimate for a specific transaction.',
    ].join('\n'),
  },
  {
    slug: 'spread-markup-calculator',
    title: 'Dealer Spread and Markup Calculator',
    summary:
      'Calculate the dealer markup above spot price for a quoted precious metals product.',
    updatedAt: '2026-04-22',
    markdown: [
      '## Formula',
      'Intrinsic metal value equals spot price multiplied by product ounces and quantity. Markup equals quoted total minus intrinsic metal value. Markup percentage equals markup divided by intrinsic metal value.',
      '',
      '## Inputs',
      '- Metal',
      '- Spot price per ounce',
      '- Product ounces',
      '- Quantity',
      '- Quoted unit price',
      '- Optional fixed dealer fee',
      '',
      '## Output',
      'The tool reports intrinsic metal value, quoted total, dollar markup, markup percentage, and markup per ounce.',
      '',
      '## Limitation',
      'Premiums can vary by product, mint, condition, size, and market liquidity. Require a written estimate before relying on any quoted terms.',
    ].join('\n'),
  },
  {
    slug: 'rmd-estimator',
    title: 'Gold IRA Required Minimum Distribution Estimator',
    summary:
      'Estimate a required minimum distribution using account value, age, and the IRS Uniform Lifetime Table.',
    updatedAt: '2026-04-22',
    markdown: [
      '## Formula',
      'Estimated RMD equals prior year-end IRA value divided by the applicable IRS life expectancy divisor.',
      '',
      '## Inputs',
      '- Birth year',
      '- Distribution year',
      '- Prior year-end IRA value',
      '',
      '## Output',
      'The tool reports estimated age, applicable SECURE 2.0 threshold, divisor, and estimated RMD.',
      '',
      '## Limitation',
      'This educational estimate does not handle every beneficiary, inherited IRA, spouse, tax, or plan-specific rule.',
    ].join('\n'),
  },
  {
    slug: 'correlation-matrix',
    title: 'Asset Class Correlation Matrix',
    summary:
      'Compare sample historical correlations between precious metals and major asset classes.',
    updatedAt: '2026-04-22',
    markdown: [
      '## Method',
      'The matrix compares monthly return relationships over selected sample timeframes. Values range from -1 to +1.',
      '',
      '## Interpretation',
      'A value near +1 means two assets tended to move together. A value near 0 means the relationship was weak. A value below 0 means they tended to move in opposite directions over the measured period.',
      '',
      '## Limitation',
      'Correlation changes over time and should not be treated as a fixed property of an asset class.',
    ].join('\n'),
  },
] as const

const bySlug = new Map(PUBLIC_TOOL_PAGES.map((tool) => [tool.slug, tool]))

export function getPublicToolPage(slug: string): PublicToolPage | undefined {
  return bySlug.get(slug)
}

export function publicToolMarkdown(tool: PublicToolPage, siteUrl: string): string {
  return [
    `# ${tool.title}`,
    '',
    `> ${tool.summary}`,
    '',
    `_Updated ${tool.updatedAt}_`,
    '',
    `Canonical URL: ${siteUrl}/tools/${tool.slug}`,
    '',
    tool.markdown,
  ].join('\n')
}
