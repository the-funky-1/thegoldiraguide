import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.accountability.written-estimate',
  pillar: 'accountability',
  slug: 'written-estimate',
  title: 'The Written Estimate: The Accountability Standard',
  summary:
    'How a preemptive written estimate transforms a precious metals IRA transaction into a verifiable agreement, with the four line items every buyer should demand.',
  metaTitle: 'The Written Estimate: Institutional Accountability',
  metaDescription:
    'The written estimate is the cornerstone of accountability in a precious metals IRA. See the four line items to demand before any purchase closes.',
  schemaJsonLdType: 'HowTo',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: [
    'accountability/transactional-spreads',
    'accountability/flat-vs-scaling-fees',
  ],
  citations: [citation('finra-metals'), citation('ftc-endorsement-guides')],
  body: [
    block(
      'intro',
      p(
        'A precious metals IRA has three moving parts. A dealer sells the metal. A custodian records it. A depository stores it. Each party quotes costs in a different format. The written estimate pulls those figures into one document that a buyer can read, compare, and keep on file. It is the single tool that turns an opaque transaction into a verifiable agreement.',
      ),
    ),
    block(
      'intro-2',
      p(
        'Dealers in precious metals are not legal fiduciaries under the Employee Retirement Income Security Act of 1974. They are not required to act in your best interest the way a registered investment adviser must. A written estimate does not change that legal status. It does something different. It forces a fiduciary standard of care into the transaction without claiming formal fiduciary status.',
      ),
    ),
    block('h2-four-items', h2('The four line items to demand')),
    block(
      'items-intro',
      p(
        'A complete written estimate contains four line items. Each is specific, measurable, and easy to verify. A buyer who receives all four on letterhead, with a signature, holds a document that serves as the basis for cost tracking, tax reporting, and future buyback math.',
      ),
    ),
    block(
      'item-1',
      p(
        'First, the exact coin or bar designation. The estimate should name the product with no ambiguity. For example, one ounce American Gold Eagle, 2026 issue, from the United States Mint. The year matters. The mint of origin matters. A generic phrase like gold coin or American Eagle is not specific enough to hold a price.',
      ),
    ),
    block(
      'item-2',
      p(
        'Second, the exact retail premium above the spot price. The premium should appear as a dollar amount and as a percent. The spot reference used for the calculation should be stated with a time stamp. For example, spot gold at three thousand dollars per ounce at 9:30 a.m. Eastern, retail premium of one hundred fifty dollars per ounce, or five percent.',
      ),
    ),
    block(
      'item-3',
      p(
        'Third, itemized administrative setup costs. The account opening fee from the custodian, any first-year account fee, and any transfer or rollover processing fee should each appear on a separate line. A total labeled setup costs is not enough. Each charge has its own purpose and its own vendor.',
      ),
    ),
    block(
      'item-4',
      p(
        'Fourth, recurring annual storage fees. The estimate should state whether the fee is flat or scaling, in plain words. If the fee is flat, the dollar amount should be listed. If the fee scales with the balance, the rate should be stated as a percent and a dollar example at the funding amount should be shown.',
      ),
    ),
    block(
      'callout-fiduciary',
      callout(
        'info',
        'Dealers are not legal fiduciaries under ERISA. A written estimate does not create a fiduciary relationship. It forces a standard of care that resembles one, by putting the math on paper and giving the buyer a fixed document to hold.',
      ),
    ),
    block('h2-why-written', h2('Why written beats verbal')),
    block(
      'why-1',
      p(
        'A verbal quote changes shape under pressure. A number spoken on a call can shift by the time the paperwork arrives. A written estimate stops the drift. Once the figures are on paper and signed, the buyer has a reference that cannot be revised without a new document.',
      ),
    ),
    block(
      'why-2',
      p(
        'A written estimate also supports tax reporting. The purchase price, the premium, and the fees become the cost basis for the account. At the time of a distribution or a buyback, those numbers appear again. A buyer who saved the estimate can reconcile the custodian statement line by line. A buyer who relied on memory cannot.',
      ),
    ),
    block(
      'why-3',
      p(
        'The written estimate acts as a risk-reversal tool. A seller who declines to produce one is asking the buyer to carry all the risk of future disputes. A seller who produces one is offering to carry a share of it. That is the simple test. The response to the request tells a buyer most of what they need to know.',
      ),
    ),
    block('h2-checklist', h2('Your checklist before any wire sends')),
    block(
      'checklist-1',
      p(
        'Before funds move from an existing retirement account into a precious metals IRA, a buyer should be able to check each of the following items. The written estimate is on file. The coin or bar designation is specific to year and mint. The spot reference is stated with a time stamp.',
      ),
    ),
    block(
      'checklist-2',
      p(
        'The premium is listed as a dollar amount and as a percent. The custodian fees are itemized with vendor names. The storage fee structure is named as flat or scaling. The total first-year cost is summed on the document. A signature and a date appear at the bottom.',
      ),
    ),
    block(
      'checklist-3',
      p(
        'If any of these items is missing, the estimate is incomplete and the transaction is not ready. A buyer who proceeds without these items is proceeding without the basis for cost tracking. That is the definition of an opaque transaction. The written estimate is the document that keeps the transaction from reaching that state.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'Is a dealer legally required to give me a written estimate?',
        'No. There is no federal rule that requires dealers in precious metals to produce a preemptive written estimate. A buyer who asks for one is setting a higher standard than the law requires. A dealer who declines is signaling a preference for verbal terms.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'What should I do if the final invoice does not match the written estimate?',
        'Stop the transaction. The estimate is the basis for the deal. A final invoice that differs by more than rounding is a new offer. Ask for a revised estimate, in writing, before funds move. If the differences cannot be explained, the transaction is not ready.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'Is a dealer legally required to give me a written estimate?',
      answer:
        'No. There is no federal rule that requires dealers in precious metals to produce a preemptive written estimate. A buyer who asks for one is setting a higher standard than the law requires.',
    },
    {
      question:
        'What should I do if the final invoice does not match the written estimate?',
      answer:
        'Stop the transaction. The estimate is the basis for the deal. A final invoice that differs by more than rounding is a new offer. Ask for a revised estimate, in writing, before funds move.',
    },
  ],
}
