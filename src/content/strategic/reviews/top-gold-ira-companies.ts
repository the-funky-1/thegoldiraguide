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
        'Choosing a Gold IRA company is a very important choice. A good partner will help you protect your retirement savings over the long term. A bad company will drain your account with hidden fees and poor customer service.',
      ),
      p(
        'The gold industry has many traps. Some dealers push rare coins that cost too much. Others charge high fees that scale as your account grows. We built this guide to help you find an honest partner.',
      ),
    ),
    block('h2-eval-criteria', h2('How We Evaluate Companies')),
    block(
      'eval-criteria',
      p(
        'We rank companies based on trust and clear pricing rules. We strongly prefer firms that charge a flat annual fee instead of a percentage. A percentage fee will slowly eat away at your overall profits.',
      ),
      p(
        'Customer service is also a critical factor in our reviews. A great company answers questions clearly without using any pressure tactics. They act like a real partner rather than a broker looking for a quick sale.',
      ),
    ),
    block('h2-red-flags', h2('Watch Out for Hidden Fees')),
    block(
      'red-flags',
      p(
        'Many companies hide their true costs from new clients. They make their profit using massive spreads on the coins they sell. This spread is the difference between the spot price of gold and what you actually pay.',
      ),
      p(
        'You must demand a written estimate before you sign any paperwork. This document should clearly show every fee in plain text. You should never rely on verbal promises from a phone call.',
      ),
      callout(
        'warning',
        'Never buy rare or graded coins for your retirement account. Dealers mark them up heavily, but their actual melt value is much lower.',
      ),
    ),
    block('h2-storage-options', h2('Storage and Security')),
    block(
      'storage-options',
      p(
        'The IRS requires you to store your IRA gold in an approved vault. You cannot keep retirement assets at your personal house. Top companies use highly secure places like the Delaware Depository.',
      ),
      p(
        'You should also make sure your gold is kept in segregated storage. This means your metals are stored completely separate from everyone else. This setup costs slightly more but offers total peace of mind.',
      ),
    ),
    block('h2-top-picks', h2('Our Top Picks for 2026')),
    block(
      'top-picks',
      p(
        'We highly rate firms that offer fully transparent pricing models. Look for companies that provide a detailed written estimate before asking you to commit.',
      ),
      p(
        'Take your time and compare several different firms before making a decision. Read their customer reviews, check their fee sheets, and see how they treat you on the phone.',
      ),
    ),
  ],
  faqs: [
    faq(
      'What is a Gold IRA company?',
      'A Gold IRA company helps you open a self-directed retirement account. They sell you the precious metals and connect you with an IRS-approved custodian and storage vault.',
    ),
    faq(
      'How much do Gold IRAs cost?',
      'Most trusted firms charge a flat setup fee of around $50 and an annual storage fee of $100 to $150. Be wary of percentage-based fees that grow as your metals gain value.',
    ),
    faq(
      'Can I hold the gold myself?',
      'No. The IRS strictly bans home storage for IRA metals. Your gold must be held in an approved depository to keep its tax-free status.',
    ),
  ],
}
