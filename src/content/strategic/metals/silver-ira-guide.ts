import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.metals.silver-ira-guide',
  pillar: 'metals',
  slug: 'silver-ira-guide',
  title: 'Silver IRA Guide',
  summary:
    'A complete guide to adding silver to your retirement account, including allowed coins and IRS purity standards.',
  metaTitle: 'Silver IRA Guide: How to Invest in Silver for Retirement',
  metaDescription:
    'Learn how to set up a Silver IRA, the IRS rules for eligible silver coins and bars, and how to diversify your retirement portfolio.',
  schemaJsonLdType: 'Article',
  publishedAt: '2026-05-01',
  updatedAt: '2026-05-01',
  authorSlug: 'jane',
  crossLinks: ['ira-rules/eligible-metals'],
  citations: [citation('irs-590a')],
  body: [
    block(
      'intro',
      p(
        'While gold is the most popular precious metal for IRAs, silver is an excellent option for diversification. The IRS has specific rules for silver in a retirement account.',
      ),
    ),
    block('h2-eligible-silver', h2('Eligible Silver Coins')),
    block(
      'eligible-silver',
      p(
        'Silver must be at least .999 fine to qualify. Popular choices include the American Silver Eagle and Canadian Silver Maple Leaf.',
      ),
    ),
  ],
  faqs: [],
}
