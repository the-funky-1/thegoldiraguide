import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.economics.capital-gains-non-ira',
  pillar: 'economics',
  slug: 'capital-gains-non-ira',
  title: 'Capital Gains Tax on Precious Metals: The 28% Rate',
  summary:
    'How the IRS taxes physical precious metals as collectibles at a long-term rate capped at 28 percent, and why the IRA wrapper changes that math in a direct way.',
  metaTitle: 'Precious Metals Capital Gains: The 28% Rate',
  metaDescription:
    'Physical gold and silver are taxed as collectibles. Long-term gains are capped at 28 percent, not the lower 15 or 20 percent rate for stocks.',
  schemaJsonLdType: 'FAQPage',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: [
    'ira-rules/rollover-mechanics',
    'economics/portfolio-volatility',
  ],
  citations: [citation('irs-590a'), citation('irs-590b')],
  body: [
    block(
      'intro',
      p(
        'The tax treatment of physical precious metals is not the same as the tax treatment of a stock or a mutual fund. The IRS classifies physical gold, silver, platinum, and palladium as collectibles. That label carries a specific long-term capital gains rate, and that rate is higher than the rate most investors expect. This piece walks through the math and places the IRA wrapper inside it.',
      ),
    ),
    block(
      'intro-2',
      p(
        'None of what follows is a substitute for advice from a tax professional. The rates and brackets discussed here reflect the general framework, not a custom plan for any one household. What the piece offers is the baseline a saver needs to compare a taxable holding with a holding inside an IRA.',
      ),
    ),
    block('h2-collectibles', h2('Why physical metal is taxed as a collectible')),
    block(
      'collect-1',
      p(
        'The Internal Revenue Code groups physical precious metals with artwork, antiques, stamps, and rare coins under the label of collectibles. The classification applies to coins and bars held outside a retirement account. An individual who buys a gold coin in a taxable brokerage account, or takes physical delivery from a dealer, is holding a collectible for tax purposes.',
      ),
    ),
    block(
      'collect-2',
      p(
        'The reason this matters is the rate. Stocks and mutual funds, held for more than a year, are taxed at long-term capital gains rates of zero, fifteen, or twenty percent depending on income. Collectibles follow a different schedule. The long-term gain on a collectible is taxed at the ordinary income rate, but capped at a maximum rate of twenty-eight percent.',
      ),
    ),
    block('h2-short-vs-long', h2('Short-term versus long-term holds')),
    block(
      'short-1',
      p(
        'The cap of twenty-eight percent applies only to gains on items held for more than one year. A coin or bar sold within twelve months of purchase is a short-term gain. Short-term gains are taxed at ordinary income rates, the same rates that apply to wages. For a higher-bracket household, that rate can reach thirty-seven percent on the top dollar.',
      ),
    ),
    block(
      'short-2',
      p(
        'The twelve-month clock starts on the day after the purchase date. The clock ends on the day the sale closes. A saver who bought a set of coins on June 5 and sold them on June 4 of the next year still has a short-term gain. A sale on June 6 crosses into long-term territory and benefits from the twenty-eight percent cap.',
      ),
    ),
    block(
      'callout-rate',
      callout(
        'warning',
        'Long-term gains on physical precious metals are capped at twenty-eight percent. That cap is higher than the fifteen or twenty percent long-term rate on stocks. The tax drag on a multi-decade taxable metals position is material, which is the mathematical reason the IRA wrapper is worth studying.',
      ),
    ),
    block('h2-etf', h2('Do the same rules apply to gold ETFs?')),
    block(
      'etf-1',
      p(
        'Most physically backed gold ETFs, the type that holds bullion in a vault, are taxed as collectibles. The same twenty-eight percent long-term rate applies to gains on those shares. The ETF wrapper does not change the underlying asset, and the IRS treats the shareholder as holding a pro rata slice of the gold for tax purposes.',
      ),
    ),
    block(
      'etf-2',
      p(
        'Other structures behave differently. A fund that holds gold mining stocks, rather than bullion, is taxed like any other equity fund. An ETN, a note that tracks the gold price, can have its own rules. A saver who wants to understand the tax treatment of a specific fund should read the prospectus carefully and confirm the treatment with a tax professional.',
      ),
    ),
    block('h2-ira', h2('How an IRA changes the math')),
    block(
      'ira-1',
      p(
        'A precious metals IRA is set up as a tax-advantaged wrapper around the same physical metal. Inside a Traditional IRA, any gains are tax-deferred. The account holder pays no tax on growth until a distribution is taken in retirement, at which point the distribution is taxed as ordinary income. The twenty-eight percent collectibles rate does not apply inside the wrapper.',
      ),
    ),
    block(
      'ira-2',
      p(
        'Inside a Roth IRA, the math shifts further. Contributions go in after tax. Growth is tax-free. Qualified distributions in retirement are tax-free. Gains on the metal, no matter how large over a multi-decade hold, are never taxed at the collectibles rate or at any other rate. The Roth wrapper changes the lifetime tax on the asset from a positive number to zero.',
      ),
    ),
    block(
      'ira-3',
      p(
        'This is the mathematical case for the IRA wrapper. A saver who plans to hold physical metal for a working career has two paths. The taxable path pays capital gains up to twenty-eight percent on long-term gains. The IRA path defers the tax in a Traditional account or eliminates the tax in a Roth account. Over thirty years of compounding, the gap is substantial.',
      ),
    ),
    block('h2-reporting', h2('Reporting requirements on a sale')),
    block(
      'report-1',
      p(
        'A sale of physical precious metals outside a retirement account is reported on Schedule D of the federal income tax return, with a supporting Form 8949. The cost basis, the sale price, and the holding period are all reported. Dealers are also required to file Form 1099-B on certain transactions involving specific coin types and quantities above set thresholds.',
      ),
    ),
    block(
      'report-2',
      p(
        'State tax rules add a further layer. Some states treat bullion sales as exempt from state sales tax. Others tax the sale at the time of purchase or at the time of resale. A saver who lives in a state with its own tax regime should confirm the rules with a state tax professional before a large transaction closes.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'How is physical gold taxed outside an IRA?',
        'Physical gold is classified as a collectible. A gain on a coin or bar held more than one year is taxed at ordinary income rates, capped at a maximum of twenty-eight percent. A gain on metal held for one year or less is taxed at ordinary income rates with no cap.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'What counts as a long-term hold for precious metals?',
        'A long-term hold means the metal was held for more than one year before sale. The clock starts the day after the purchase date and ends the day the sale closes. A sale on the one-year anniversary is still short-term. A sale one day later is long-term.',
      ),
    ),
    block(
      'faq-3',
      faq(
        'Does the 28 percent rate apply to gold ETFs?',
        'It applies to most physically backed gold ETFs, which the IRS treats as a slice of the underlying bullion. It does not apply to funds that hold mining stocks, which are taxed like other equity funds. A saver should confirm the treatment of a specific fund in its prospectus.',
      ),
    ),
    block(
      'faq-4',
      faq(
        'Does the 28 percent rate apply inside an IRA?',
        'No. Gains inside a Traditional IRA are tax-deferred until distribution, at which point the distribution is taxed as ordinary income. Gains inside a Roth IRA are never taxed, provided the distribution is qualified. The collectibles rate does not reach into the IRA wrapper.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'How is physical gold taxed outside an IRA?',
      answer:
        'Physical gold is classified as a collectible. A gain on a coin or bar held more than one year is taxed at ordinary income rates, capped at a maximum of twenty-eight percent. A gain on metal held for one year or less is taxed at ordinary income rates.',
    },
    {
      question: 'What counts as a long-term hold for precious metals?',
      answer:
        'A long-term hold means the metal was held for more than one year before sale. The clock starts the day after the purchase date and ends the day the sale closes. A sale on the one-year anniversary is still short-term. A sale one day later is long-term.',
    },
    {
      question: 'Does the 28 percent rate apply to gold ETFs?',
      answer:
        'It applies to most physically backed gold ETFs, which the IRS treats as a slice of the underlying bullion. It does not apply to funds that hold mining stocks, which are taxed like other equity funds. Confirm the treatment of a specific fund in its prospectus.',
    },
    {
      question: 'Does the 28 percent rate apply inside an IRA?',
      answer:
        'No. Gains inside a Traditional IRA are tax-deferred until distribution, at which point the distribution is taxed as ordinary income. Gains inside a Roth IRA are never taxed, provided the distribution is qualified. The collectibles rate does not reach into the IRA wrapper.',
    },
  ],
}
