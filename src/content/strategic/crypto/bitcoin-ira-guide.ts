import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.crypto.bitcoin-ira-guide',
  pillar: 'crypto',
  slug: 'bitcoin-ira-guide',
  title: 'The Ultimate Guide to Bitcoin IRAs',
  summary:
    'How to add Bitcoin and other cryptocurrencies to your retirement portfolio.',
  metaTitle: 'Bitcoin IRA Guide: How to Invest in Crypto for Retirement',
  metaDescription:
    'Learn the basics of setting up a Bitcoin IRA, including tax implications, storage options, and top crypto IRA companies.',
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
        'Cryptocurrency offers a new frontier for retirement investing. A Crypto IRA allows you to hold digital assets in a tax-advantaged account.',
      ),
    ),
    block('h2-how-it-works', h2('How Crypto IRAs Work')),
    block(
      'how-it-works',
      p(
        'Similar to a Gold IRA, a Crypto IRA is a self-directed retirement account. You must use an approved custodian to hold the digital keys on your behalf.',
      ),
    ),
  ],
  faqs: [],
}
