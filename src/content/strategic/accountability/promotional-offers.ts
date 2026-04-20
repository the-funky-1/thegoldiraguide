import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.accountability.promotional-offers',
  pillar: 'accountability',
  slug: 'promotional-offers',
  title: 'The Economics of Precious Metals Promotional Offers',
  summary:
    'A clinical look at the math behind free silver offers, matching asset programs, and first-year fee waivers in the precious metals IRA channel.',
  metaTitle: 'The Economics of Precious Metals Promotional Offers',
  metaDescription:
    'Free silver, matching assets, and first-year fee waivers are funded through elevated spreads. Learn how to run a holistic cost-benefit on any promotion.',
  schemaJsonLdType: 'Article',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: [
    'accountability/transactional-spreads',
    'accountability/written-estimate',
  ],
  citations: [citation('finra-metals')],
  body: [
    block(
      'intro',
      p(
        'Promotional offers are common in the precious metals IRA channel. A new account may be offered free silver, a matching asset program, or a first-year waiver on storage and administrative fees. Each offer has the same economic structure. The promised benefit is not free. It is funded through the spread on the core asset purchase that opens the account.',
      ),
    ),
    block(
      'intro-2',
      p(
        'This article describes the math without commentary on any firm. The goal is to give a reader a simple way to evaluate any promotional offer on its own terms. Run the numbers, compare the totals, and decide based on the result. The calculation is the same whether the promotion is small or large.',
      ),
    ),
    block('h2-how-funded', h2('How promotions are funded')),
    block(
      'funded-1',
      p(
        'A promotional offer is a marketing expense. Marketing expenses are paid from revenue. Revenue on a precious metals IRA transaction comes from the spread, which is the gap between the wholesale metal cost and the retail price charged to the account. A larger promotion requires a larger spread to cover it.',
      ),
    ),
    block(
      'funded-2',
      p(
        'A free silver offer provides a fixed dollar amount of silver to the new account. The silver itself has a wholesale cost to the dealer. That cost is recovered by adjusting the premium on the gold or silver purchase that funds the account. A ten thousand dollar bonus on a one hundred thousand dollar account is a ten percent addition to the premium range the buyer should expect.',
      ),
    ),
    block(
      'funded-3',
      p(
        'A matching asset program follows the same pattern at a different scale. If the promotion matches a share of the account funding amount with additional metal, the matched portion is funded by the same spread mechanism. The spread on the base purchase is set high enough to cover the match and the administrative cost of running the program.',
      ),
    ),
    block(
      'funded-4',
      p(
        'A first-year fee waiver removes one year of storage or administrative fees from the account invoice. One year of fees on a one hundred thousand dollar account typically ranges from one hundred fifty to seven hundred fifty dollars. That amount is also funded by the spread on the initial purchase.',
      ),
    ),
    block(
      'callout-math',
      callout(
        'info',
        'The math is not a secret. It is arithmetic. Every promotion has a real cost. That cost appears somewhere on the invoice. A buyer who looks for it finds it. A buyer who does not look pays for it.',
      ),
    ),
    block('h2-inescapable', h2('Operational costs are inescapable')),
    block(
      'inescapable-1',
      p(
        'Depository storage, vault insurance, and custodian administration are real operational costs. A depository pays for a secured facility, guards, insurance, and audits. A custodian pays for account staff, technology, and compliance. Those costs are absolute. They do not go away when a promotion is applied.',
      ),
    ),
    block(
      'inescapable-2',
      p(
        'A first-year fee waiver shifts the timing of those costs. The costs are still incurred in year one. They are just not billed to the account in that year. The dealer absorbs the cost up front and earns it back through the elevated spread on the initial purchase. The total paid across the first few years remains close to the total a buyer would pay without the promotion.',
      ),
    ),
    block(
      'inescapable-3',
      p(
        'This is not a criticism of any specific offer. It is a description of how such programs are structured in any industry that combines a one-time transaction with a recurring service. The buyer benefits when the total cost of the relationship is evaluated, not when a single line item is highlighted.',
      ),
    ),
    block('h2-holistic', h2('How to run a holistic cost-benefit')),
    block(
      'holistic-1',
      p(
        'The holistic test compares the total spread paid against the spot value of the promotional item. Start with the retail price of the core purchase. Subtract the spot price of the metal at the time of the quote. The result is the total premium paid. Express it in dollars and as a percent of spot.',
      ),
    ),
    block(
      'holistic-2',
      p(
        'Next, value the promotional item at its spot price. If the promotion is free silver, multiply the silver ounces offered by the silver spot price. If the promotion is a fee waiver, sum the waived fees. That figure is the benefit at spot value.',
      ),
    ),
    block(
      'holistic-3',
      p(
        'Compare the two. If the total premium paid is greater than the benefit at spot value, the buyer is paying the difference as a net cost. If the two figures are close, the promotion is roughly a wash. If the premium is smaller than the benefit, the buyer is ahead, and that result should be confirmed twice before the wire sends.',
      ),
    ),
    block('h2-apply', h2('Applying the test in practice')),
    block(
      'apply-1',
      p(
        'A buyer who applies the test asks the dealer for the same written estimate that every transaction deserves. The estimate should list the spot reference, the core purchase premium in dollars and percent, the itemized first-year fees, and the retail value of the promotional item. Each line is a number on paper, not a line in a sales script.',
      ),
    ),
    block(
      'apply-2',
      p(
        'With the numbers on paper, the test takes less than five minutes. A spreadsheet is helpful, but a calculator is enough. The point is not to build a model. The point is to convert a marketing message into an arithmetic comparison.',
      ),
    ),
    block(
      'apply-3',
      p(
        'If the numbers support the offer, the buyer proceeds with clear eyes. If the numbers do not support the offer, the buyer can ask for a revised estimate without the promotion, and compare that figure against the promotional version. Sometimes the non-promotional quote is the better deal. Sometimes it is not. The written estimate is the only way to know.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'Is a free silver offer a good deal?',
        'It depends on the spread charged on the core purchase. If the premium on the gold or silver that funds the account is higher than the spot value of the silver offered, the buyer is paying for the silver through that premium. The written estimate makes the answer visible.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'Do first-year fee waivers save money over the long term?',
        'Not always. The waived fees are usually funded by an elevated spread on the initial purchase. Over a ten or twenty year horizon, the savings and the added spread tend to be close in total. Compare both versions in writing before the account is funded.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'Is a free silver offer a good deal?',
      answer:
        'It depends on the spread charged on the core purchase. If the premium on the gold or silver that funds the account is higher than the spot value of the silver offered, the buyer is paying for the silver through that premium.',
    },
    {
      question: 'Do first-year fee waivers save money over the long term?',
      answer:
        'Not always. The waived fees are usually funded by an elevated spread on the initial purchase. Over a ten or twenty year horizon, the savings and the added spread tend to be close in total.',
    },
  ],
}
