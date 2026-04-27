import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.plans.roth-ira-gold',
  pillar: 'plans',
  slug: 'roth-ira-gold',
  title: 'Gold in a Roth IRA',
  summary:
    'How to hold physical gold and silver in a Roth IRA for tax-free growth and distributions.',
  metaTitle: 'Gold Roth IRA: Tax-Free Precious Metals Investing',
  metaDescription:
    'Explore the benefits of a Gold Roth IRA. Learn how to invest in precious metals with after-tax dollars for tax-free growth.',
  schemaJsonLdType: 'Article',
  publishedAt: '2026-05-01',
  updatedAt: '2026-05-01',
  authorSlug: 'jane',
  crossLinks: ['ira-rules/rollover-mechanics'],
  citations: [citation('irs-590a')],
  body: [
    block(
      'intro',
      p(
        'A Roth IRA offers a powerful way to invest in physical gold. By using after-tax dollars, your precious metals can grow tax-free, and you will not pay taxes on qualified distributions.',
      ),
    ),
    block('h2-benefits', h2('Benefits of a Gold Roth IRA')),
    block(
      'benefits',
      p(
        'Unlike a traditional IRA, a Roth IRA does not require you to pay taxes when you withdraw your assets in retirement. This makes it an ideal vehicle for assets you believe will appreciate significantly.',
      ),
    ),
  ],
  faqs: [],
}
