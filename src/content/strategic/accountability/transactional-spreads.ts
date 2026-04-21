import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.accountability.transactional-spreads',
  pillar: 'accountability',
  slug: 'transactional-spreads',
  title: 'Precious Metals Spreads and Dealer Premiums',
  summary:
    'A clear breakdown of the bid-ask spread, wholesale melt value, fabrication costs, and retail markup that set the true price of a precious metals purchase.',
  metaTitle: 'Precious Metals Spreads and Dealer Premiums',
  metaDescription:
    'Understand the bid-ask spread in precious metals. See how spot price, melt value, fabrication, and retail markup combine into the final premium you pay.',
  schemaJsonLdType: 'FinancialProduct',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: [
    'accountability/written-estimate',
    'accountability/bullion-vs-numismatic',
  ],
  citations: [citation('finra-metals')],
  body: [
    block(
      'intro',
      p(
        'Every precious metals purchase has a price you see and a price you pay. The price you see is the spot price on a market data feed. The price you pay is the spot price plus a premium. That premium is the spread. Readers who learn to read the spread gain a clear view of cost basis and future exit value.',
      ),
    ),
    block('h2-components', h2('The four parts of the bid-ask spread')),
    block(
      'components-1',
      p(
        'A dealer price is built from four parts. The spot price is the live market quote for one ounce of metal. The wholesale melt value is the refined metal content of the specific coin or bar. The fabrication cost covers minting, striking, and packaging. The retail markup is the dealer margin that funds the sales channel and profit.',
      ),
    ),
    block(
      'components-2',
      p(
        'The formula is simple. Retail Price minus Spot Price equals Premium. The premium covers fabrication and retail markup, and it also reflects supply and demand for the specific product. A one-ounce bar from a major refiner trades at a narrow premium. A limited mintage coin can trade at a much wider one.',
      ),
    ),
    block(
      'components-3',
      p(
        'The bid is what a dealer will pay to buy a coin back from you. The ask is what the same dealer will sell the coin for. The gap between the two is the dealer spread. On sovereign bullion, that gap is narrow. On numismatic products, the gap can swallow years of metal price gains.',
      ),
    ),
    block('h2-ranges', h2('Typical premium ranges')),
    block(
      'ranges-1',
      p(
        'Sovereign bullion carries the tightest spreads. One-ounce American Gold Eagles, Canadian Maple Leafs, and Austrian Philharmonics usually trade at one to five percent over spot on the ask side. Silver sovereign coins trade wider because silver has a higher fabrication cost per dollar of metal value.',
      ),
    ),
    block(
      'ranges-2',
      p(
        'Bars from recognized refiners trade at the low end of that range. A one-kilogram gold bar from a London Bullion Market Association member often trades near one to two percent over spot. Fractional bars and smaller coins carry higher fabrication costs per ounce and trade at wider premiums.',
      ),
    ),
    block(
      'ranges-3',
      p(
        'Fabricated or proof products shift the range higher. A proof coin in a custom display case can trade at ten to thirty percent over spot. A graded or limited issue coin can trade higher still. The markup funds the packaging and the sales narrative, not the metal itself.',
      ),
    ),
    block(
      'callout-arithmetic',
      callout(
        'info',
        'The arithmetic is the same for every product. Retail Price minus Spot Price equals Premium. Write this down. Ask for it in a written estimate before any purchase closes.',
      ),
    ),
    block('h2-why-varies', h2('Why the premium varies')),
    block(
      'why-1',
      p(
        'Markups vary widely by asset and by institution. Two buyers can pay very different premiums for the same coin on the same day. The mint of origin, the year of issue, and the sales channel all shift the price. A direct mint order carries one set of costs. A retail dealer order carries another. A broker-driven IRA transaction carries a third.',
      ),
    ),
    block(
      'why-2',
      p(
        'Volume discounts exist but they are not automatic. A larger order can earn a tighter spread if the buyer asks. A smaller order rarely earns the same terms. The spread is a posted price, not a fixed price, and a buyer can negotiate inside the stated range.',
      ),
    ),
    block('h2-written', h2('The written estimate is the only honest measure')),
    block(
      'written-1',
      p(
        'A written estimate is the only mathematical way to calculate true cost basis. A verbal quote can drift. An advertised price can exclude fees. An estimate on letterhead, with the spot reference locked and the premium stated in both dollars and percent, gives a buyer a fixed point to compare against the market.',
      ),
    ),
    block(
      'written-2',
      p(
        'A clean estimate lists the coin or bar, the spot price at the moment of quotation, the retail premium in dollars, the retail premium as a percent of spot, and any administrative or storage fees. With those five numbers on paper, a buyer can model the full ten-year, twenty-year, or thirty-year impact of the transaction.',
      ),
    ),
    block(
      'written-3',
      p(
        'The written estimate also sets an exit benchmark. If the buyback spread at the same dealer is eight percent, and the purchase premium was fifteen percent, the buyer knows the metal price must rise by more than twenty-three percent before a profitable sale is possible. That is a useful number to hold in mind.',
      ),
    ),
    block('h2-takeaway', h2('What disciplined buyers do')),
    block(
      'takeaway-1',
      p(
        'Disciplined buyers treat the spread as the first due diligence item, not the last. They check the spot price on two independent feeds. They ask for a written estimate. They compare the quoted premium to posted ranges for the same product at other channels. They keep the estimate on file.',
      ),
    ),
    block(
      'takeaway-2',
      p(
        'None of this requires special training. It requires a notepad, five minutes, and a willingness to ask for numbers on paper. The dealers who want long-term clients will answer the questions. The ones who refuse are answering a different question.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'What is the spread on precious metals?',
        'The spread is the gap between the bid price a dealer will pay and the ask price a dealer will charge. It covers fabrication, shipping, insurance, and profit. Sovereign bullion usually trades at one to five percent over spot.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'How do I calculate the true premium on a coin?',
        'Subtract the spot price from the retail price. The result is the premium in dollars. Divide by the spot price and multiply by one hundred to express it as a percent. Ask for both numbers in writing before a purchase closes.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'What is the spread on precious metals?',
      answer:
        'The spread is the gap between the bid price a dealer will pay and the ask price a dealer will charge. It covers fabrication, shipping, insurance, and profit. Sovereign bullion usually trades at one to five percent over spot.',
    },
    {
      question: 'How do I calculate the true premium on a coin?',
      answer:
        'Subtract the spot price from the retail price. The result is the premium in dollars. Divide by the spot price and multiply by one hundred to express it as a percent. Ask for both numbers in writing before a purchase closes.',
    },
  ],
}
