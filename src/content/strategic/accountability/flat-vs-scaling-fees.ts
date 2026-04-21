import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, h3, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.accountability.flat-vs-scaling-fees',
  pillar: 'accountability',
  slug: 'flat-vs-scaling-fees',
  title: 'Flat-Rate vs Percentage Storage Fees',
  summary:
    'How flat operational storage fees and percentage-based asset fees compound across ten, twenty, and thirty years inside a precious metals IRA.',
  metaTitle: 'Flat-Rate vs Percentage Storage Fees',
  metaDescription:
    'Flat storage fees stay fixed. Percentage fees scale with your balance. See how each structure compounds across ten, twenty, and thirty year horizons.',
  schemaJsonLdType: 'Guide',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: ['accountability/written-estimate'],
  citations: [citation('finra-metals')],
  body: [
    block(
      'intro',
      p(
        'Storage and administration fees are the quiet expense line inside a precious metals IRA. They do not show on a quarterly statement as a bold number. They show as a small deduction each year. The structure of that deduction matters more than the first-year dollar amount. A flat fee and a percentage fee on the same account can diverge by tens of thousands of dollars over a working career.',
      ),
    ),
    block('h2-structures', h2('Two fee structures, two math problems')),
    block(
      'structures-1',
      p(
        'A flat-rate storage fee is a fixed annual charge. It does not move with the account balance. A common flat fee runs between one hundred and two hundred fifty dollars per year for vault storage, plus a similar administrative fee. The total holds steady whether the account is worth fifty thousand or five hundred thousand.',
      ),
    ),
    block(
      'structures-2',
      p(
        'A percentage fee, sometimes called a scaling fee or an assets under management fee, is a share of the account balance. The common range is zero point five percent to one percent per year. On a one hundred thousand dollar account, zero point seven five percent is seven hundred fifty dollars. The fee grows as the account grows.',
      ),
    ),
    block(
      'structures-3',
      p(
        'The first-year numbers often look close. The long-term numbers do not. A fee drag that rises with the account compounds differently than one that stays level. The gap widens with each passing year.',
      ),
    ),
    block('h2-compounding', h2('The thirty-year compounding picture')),
    block(
      'compounding-intro',
      p(
        'Consider a one hundred thousand dollar starting balance that grows at an assumed five percent per year before fees. The comparison below uses a flat fee of two hundred twenty five dollars per year against a scaling fee of zero point seven five percent of assets per year.',
      ),
    ),
    block('h3-ten', h3('Ten years')),
    block(
      'ten-1',
      p(
        'With the flat fee, cumulative fees paid come to about two thousand two hundred fifty dollars. With the scaling fee, cumulative fees paid come to about nine thousand dollars. The difference is modest but already visible.',
      ),
    ),
    block('h3-twenty', h3('Twenty years')),
    block(
      'twenty-1',
      p(
        'With the flat fee, cumulative fees are about four thousand five hundred dollars. With the scaling fee, cumulative fees climb to roughly twenty four thousand dollars. The scaling fee has now removed more than five times the flat fee.',
      ),
    ),
    block('h3-thirty', h3('Thirty years')),
    block(
      'thirty-1',
      p(
        'With the flat fee, cumulative fees total about six thousand seven hundred fifty dollars. With the scaling fee, cumulative fees total near fifty four thousand dollars. The ending balance differs by a larger figure once lost compounding on the paid fees is counted.',
      ),
    ),
    block(
      'callout-math',
      callout(
        'info',
        'These figures use rounded assumptions to illustrate scale, not to predict any specific account. The written estimate from your custodian should show the exact fee schedule in dollars and as a percentage.',
      ),
    ),
    block('h2-why', h2('Why the structure drives the outcome')),
    block(
      'why-1',
      p(
        'A flat fee behaves like a subscription. The cost is known. The cost stays put. A well-performing account feels the flat fee less over time because the fee shrinks as a share of the balance. A slow-performing account feels it more.',
      ),
    ),
    block(
      'why-2',
      p(
        'A percentage fee behaves like a tax on success. Every year the account grows, the fee grows with it. On a large and long-held account, the scaling fee can remove a meaningful share of the total return. The fee does more work than the fee schedule alone suggests, because each fee dollar paid also forfeits future compounding.',
      ),
    ),
    block(
      'why-3',
      p(
        'Operational costs at the depository and the custodian do not scale the same way. The vault space for a one hundred thousand dollar holding and a five hundred thousand dollar holding is nearly identical. The administrative work per account is similar. A flat fee reflects the operational reality. A percentage fee reflects a pricing choice.',
      ),
    ),
    block('h2-questions', h2('Questions to ask before you sign')),
    block(
      'questions-1',
      p(
        'Ask the custodian to state the fee structure in writing. Ask for the base fee, the scaling portion if any, and the full list of add-on charges. Wire fees, account closure fees, and distribution fees are common additions that do not appear in headline rates.',
      ),
    ),
    block(
      'questions-2',
      p(
        'Ask for a ten-year, twenty-year, and thirty-year projection using the custodian own fee schedule on a sample balance. A custodian who serves long-term clients will produce this without friction. A custodian who declines is signaling something useful.',
      ),
    ),
    block(
      'questions-3',
      p(
        'Ask how fees are billed. Some custodians deduct from the cash portion of the account. Others require an annual check or a credit card on file. The billing method matters for the mix of metal and cash you hold.',
      ),
    ),
    block('h2-takeaway', h2('The disciplined position')),
    block(
      'takeaway-1',
      p(
        'Readers who are saving for decades should weigh the fee structure with the same care as the coin premium. A flat-rate structure aligns with the fixed operational cost of holding metal in a vault. A percentage structure transfers more of the growth to the administrator. Neither is wrong in every case. Each should be chosen on paper, not by default.',
      ),
    ),
    block(
      'takeaway-2',
      p(
        'Demand written clarification on fee structure before any transfer lands. The time to ask is before the account is funded. The cost of asking later is paid one year at a time, for as long as the account exists.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'Is a flat fee always cheaper than a percentage fee?',
        'Over long horizons on larger balances, a flat fee usually costs less. On smaller or shorter-lived accounts, the difference is narrower and can tilt either way.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'What fee structure do most precious metals IRA custodians use?',
        'Both structures are common. Some custodians use flat fees for storage and administration. Others use a scaling fee on assets under custody. A written estimate is the only reliable way to confirm which applies to your account.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'Is a flat fee always cheaper than a percentage fee?',
      answer:
        'Over long horizons on larger balances, a flat fee usually costs less. On smaller or shorter-lived accounts, the difference is narrower and can tilt either way.',
    },
    {
      question:
        'What fee structure do most precious metals IRA custodians use?',
      answer:
        'Both structures are common. Some custodians use flat fees for storage and administration. Others use a scaling fee on assets under custody. A written estimate is the only reliable way to confirm which applies to your account.',
    },
  ],
}
