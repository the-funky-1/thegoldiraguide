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
        'A Roth IRA is an incredibly powerful financial tool for your long-term retirement planning. You contribute after-tax income, but your future capital growth remains totally free from taxation. When you finally reach retirement age, you can take big withdrawals without causing any tax bills.',
      ),
      p(
        'Modern rules allow investors to hold physical gold inside a special Roth IRA. This fresh approach provides you with a great combination of benefits. You acquire the safety of hard assets alongside the massive tax perks tied to a Roth account.',
      ),
    ),
    block('h2-how-it-works', h2('How a Roth Gold IRA Works')),
    block(
      'how-it-works',
      p(
        'Setting up a Roth Gold IRA is a relatively simple paperwork process. You begin by making a self-directed Roth IRA through an approved custodian. Next, you fund the new account using either cash deposits or a rollover from a past Roth plan.',
      ),
      p(
        'Once your starting funds successfully clear, you can select your desired precious metals. Your chosen custodian officially buys the gold for you and safely ships it to a certified vault. You are strictly forbidden from keeping these assets at your own house.',
      ),
    ),
    block('h2-traditional-vs-roth', h2('Traditional vs. Roth')),
    block(
      'traditional-vs-roth',
      p(
        'A Traditional IRA provides an immediate tax break on your current income taxes. You avoid paying taxes on your starting funds, but you will eventually owe income tax when you sell the physical gold later in life.',
      ),
      p(
        'A Roth IRA works using the exact opposite idea. You receive absolutely no upfront tax break today. However, all future market growth is fully sheltered from taxes. If gold prices surge over the next decade, you retain every single penny of that profit.',
      ),
    ),
    block('h2-conversions', h2('Roth Conversions')),
    block(
      'conversions',
      p(
        'If you currently have a Traditional IRA, you can choose to turn it into a Roth IRA. This money move is called a Roth conversion. You must carefully figure out and pay the required income taxes on the full converted amount during the current year.',
      ),
      p(
        'Smart investors often do this strategy when current gold prices are temporarily low. They willingly pay the tax burden right away. Then, when the precious metals finally rise in value, all the newly created wealth remains fully protected from future IRS taxes.',
      ),
      callout(
        'warning',
        'We strongly suggest talking with a trusted tax expert before doing a large Roth conversion. A massive account conversion can easily push you into a much higher tax bracket for the current calendar year.',
      ),
    ),
  ],
  faqs: [
    faq(
      'Can I hold gold and stocks in the same Roth IRA?',
      'Yes, if your custodian allows it. However, most people open a specific self-directed IRA just for their physical metals.',
    ),
    faq(
      'Are there age limits for Roth IRA contributions?',
      'No. As long as you have earned income, you can keep putting money into a Roth IRA at any age.',
    ),
  ],
}
