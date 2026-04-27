import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.reviews.top-gold-ira-companies',
  pillar: 'reviews',
  slug: 'top-gold-ira-companies',
  title: 'Top Gold IRA Companies Reviewed',
  summary:
    'An unbiased look at the leading Gold IRA companies, focusing on fees, customer service, and accountability.',
  metaTitle: 'Top Gold IRA Companies - Reviews and Comparisons',
  metaDescription:
    'Read our comprehensive, unbiased reviews of the top Gold IRA companies to make an informed decision for your retirement savings.',
  schemaJsonLdType: 'Article',
  publishedAt: '2026-05-01',
  updatedAt: '2026-05-01',
  authorSlug: 'jane',
  crossLinks: [
    'accountability/transactional-spreads',
    'accountability/written-estimate',
  ],
  citations: [citation('irs-590a')],
  body: [
    block(
      'intro',
      p(
        'Choosing the right Gold IRA company is crucial. This guide breaks down the top companies in the industry, comparing their fees, storage options, and customer reviews.',
      ),
    ),
    block('h2-criteria', h2('Evaluation Criteria')),
    block(
      'criteria',
      p(
        'We evaluate companies based on transparency, fee structures, customer support, and track record. Avoid companies with hidden fees or aggressive sales tactics.',
      ),
    ),
  ],
  faqs: [],
}
