import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, h3, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.tools.fee-drag-analyzer',
  pillar: 'tools',
  slug: 'fee-drag-analyzer',
  title: 'Precious Metals Portfolio Fee Drag Calculator',
  summary:
    'A plain-language guide to how fees compound inside a precious metals IRA, the yearly math the tool performs, and how to read the gap between a flat fee and a scaling fee structure.',
  metaTitle: 'Precious Metals Portfolio Fee Drag Calculator',
  metaDescription:
    'Understand how flat and scaling fees compound inside a precious metals IRA. Review the yearly calculation and the long-term cost difference.',
  schemaJsonLdType: 'FinancialProduct',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: [
    'accountability/flat-vs-scaling-fees',
    'accountability/written-estimate',
  ],
  citations: [citation('finra-metals')],
  body: [
    block(
      'intro',
      p(
        'The fee drag calculator answers one important question that every long-term retirement saver should consider. How much does a yearly administrative fee quietly remove from a precious metals individual retirement account across ten, twenty, or thirty years of compounding? The tool takes a small set of inputs and runs the arithmetic year by year. The cumulative cost becomes visible in real dollar terms.',
      ),
    ),
    block(
      'intro-2',
      p(
        'The inputs are simple. A starting balance. An expected yearly return before fees. A fee structure, either a flat dollar amount or a percent of the balance. A time horizon in years. The tool then returns the projected ending balance and the total fees paid across the period.',
      ),
    ),
    block('h2-inputs', h2('What the calculator asks for')),
    block(
      'inputs-1',
      p(
        'The starting balance represents the dollar value in the retirement account on the day the projection begins. The expected return is the yearly percentage the account is assumed to earn before any administrative fees are deducted. Five percent is a common long-horizon planning assumption. Readers should pick a return that matches their personal view of the market, not an aggressive figure meant to flatter the ending number.',
      ),
    ),
    block(
      'inputs-2',
      p(
        'The fee structure is the key input for this comparison exercise. A flat fee stays constant every year regardless of how the balance grows across time. A scaling fee is a fixed percentage of the balance recalculated on the yearly statement. Some custodians apply one structure, others apply the other, and a written estimate from the custodian reveals which method applies to your particular account.',
      ),
    ),
    block(
      'inputs-3',
      p(
        'The time horizon is the number of years the retirement account will remain open before distributions begin. A ten year window illustrates a short planning view. A twenty year window reflects a mid-career accumulation stretch. A thirty year window represents a full working career from early saving through retirement. The gap between flat and scaling fee paths widens substantially as the horizon gets longer.',
      ),
    ),
    block('h2-math', h2('The arithmetic performed each year')),
    block(
      'math-1',
      p(
        'The tool loops across each year in the horizon. The formula for one year is simple in words. Each year: balance times one plus the return, minus the fee that applies. A flat fee takes out a fixed dollar amount. A scaling fee takes out the balance times the fee percent.',
      ),
    ),
    block(
      'math-2',
      p(
        'The order matters for the final result. The tool first grows the balance by the yearly return. Then it takes out the fee. The result is the opening balance for the next year. Over thirty years, the tool runs this loop thirty times and adds up the fees paid each year.',
      ),
    ),
    block(
      'callout-formula',
      callout(
        'info',
        'The one-year calculation the tool performs: balance multiplied by one plus the return, minus the applicable annual fee. A flat fee is a fixed dollar number. A scaling fee is the balance multiplied by a percentage. Repeat this calculation for every year in the selected horizon.',
      ),
    ),
    block('h2-compare', h2('Why flat and scaling fees diverge')),
    block('h3-flat', h3('The flat fee path')),
    block(
      'flat-1',
      p(
        'A flat fee is a fixed dollar charge applied every year regardless of the account size. Two hundred twenty five dollars a year stays two hundred twenty five dollars a year even as the balance appreciates. As the balance grows, the flat fee becomes a smaller share of the total account. The effective drag measured as a percentage of assets shrinks gradually each year.',
      ),
    ),
    block('h3-scaling', h3('The scaling fee path')),
    block(
      'scaling-1',
      p(
        'A scaling fee is a percentage of the balance and is recalculated every year. One percent of a larger balance is naturally a larger dollar amount. As the balance grows through yearly investment returns, the scaling fee grows in direct proportion. The drag measured in percentage terms stays constant. The drag measured in dollars climbs steadily each year.',
      ),
    ),
    block(
      'scaling-2',
      p(
        'The calculator makes this divergence easy to see in concrete numbers. On a one hundred thousand dollar starting balance earning five percent over thirty years, the two paths produce very different outcomes. A flat fee near two hundred twenty five dollars a year ends substantially below a scaling fee near one percent. The ending balance gap is larger than the cumulative fee gap alone, because fees paid in early years also forfeit future compounding.',
      ),
    ),
    block('h2-reading', h2('How to interpret the results')),
    block(
      'reading-1',
      p(
        'Two output numbers deserve attention. The ending balance is the headline. The total fees paid is the drag. Both numbers move as the inputs change. A small change in the fee rate makes a large change in the thirty-year result once compounding is included.',
      ),
    ),
    block(
      'reading-2',
      p(
        'Run the tool twice for a useful comparison. First with the exact fee schedule on your written estimate. Then with a flat fee matching the first year dollar amount. The gap between the two runs is the long-term cost of the scaling structure. That gap is the number readers should weigh.',
      ),
    ),
    block('h2-limits', h2('What the calculator does not model')),
    block(
      'limits-1',
      p(
        'The tool is a planning aid and not a market forecast. It does not predict the real path of spot prices. It does not model income taxes or distributions. It does not include add-on charges such as wire fees, account closure fees, or in-kind distribution fees. It runs clean compound math on the inputs you give it.',
      ),
    ),
    block(
      'limits-2',
      p(
        'Use the tool with a written estimate from the custodian. The estimate shows the real fee schedule in binding language. The tool turns that schedule into long-term dollar outcomes. Together they produce a full picture of the cost of holding the account over a working career.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'What yearly return should I enter into the calculator?',
        'Pick a return assumption that reflects your personal view of the long-term precious metals market. Five percent is a common planning figure. The calculator does not suggest a specific value. The purpose is to hold the return steady while varying the fee input so the isolated fee effect becomes visible.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'Does the calculator include tax treatment?',
        'No. The calculator performs pre-tax arithmetic on the account. Tax treatment inside a Traditional or Roth retirement account is covered in other pages on this site. For a taxable account outside the retirement wrapper, the fee drag calculation is similar but the tax calculation is handled separately.',
      ),
    ),
    block(
      'faq-3',
      faq(
        'Can I model a mixed fee structure combining both types?',
        'The current calculator models a single fee type at a time. To approximate a mixed structure, run the calculator twice and add the fee totals together. A future version may accept a combined fee input. The written estimate from the custodian remains the authoritative source.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'What yearly return should I enter into the calculator?',
      answer:
        'Pick a return assumption that reflects your own view of the long-term market. Five percent is a common planning figure. The calculator does not suggest a specific value. The purpose is to hold the return steady while varying the fee input.',
    },
    {
      question: 'Does the calculator include tax treatment?',
      answer:
        'No. The calculator runs pre-tax arithmetic on the account. Tax treatment inside a Traditional or Roth IRA is covered in other pages on this site. For a taxable account outside the IRA wrapper, the fee drag calculation is similar but the tax math is separate.',
    },
    {
      question: 'Can I model a mixed fee structure combining both types?',
      answer:
        'The current calculator models one fee type at a time. To approximate a mixed structure, run the calculator twice and add the fee totals together. A future version may accept a combined fee input. The written estimate remains the source of truth.',
    },
  ],
}
