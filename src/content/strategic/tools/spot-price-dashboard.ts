import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, h3, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.tools.spot-price-dashboard',
  pillar: 'tools',
  slug: 'spot-price-dashboard',
  title: 'Live Precious Metals Spot Prices and Historical Charts',
  summary:
    'A plain-language explanation of what the wholesale spot price really represents, how it differs from the retail price a consumer actually pays, and why the historical chart view matters for analysis.',
  metaTitle: 'Live Precious Metals Spot Prices',
  metaDescription:
    'Understand the wholesale spot price, how it differs from the retail price consumers pay, and why historical charts matter for precious metals analysis.',
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
        'The spot price dashboard shows the current wholesale quote for gold, silver, platinum, and palladium. The page also offers a historical chart so a saver can track the metal over recent weeks, months, and years. One question matters most. What does the spot price stand for, and how does it compare to the price a consumer is actually asked to pay?',
      ),
    ),
    block('h2-what-is-spot', h2('What the spot price really means')),
    block(
      'spot-1',
      p(
        'The spot price is the wholesale quote for an ounce of metal that is ready for near-term delivery between large firms in the global market. It is set all day through trading on exchanges and between big firms in the over-the-counter market. The quote shows on data terminals and feeds the charts you see on public websites.',
      ),
    ),
    block(
      'spot-2',
      p(
        'The spot price is not the price a buyer can pay for one ounce of physical metal in hand. It is a reference number for the wholesale cost of the metal before any fabrication, distribution, or dealer margin is added. The spot quote is the start point for every retail quote, not the retail quote itself.',
      ),
    ),
    block('h2-retail-ask', h2('The retail ask price a consumer actually pays')),
    block(
      'retail-1',
      p(
        'The retail ask price is the dollar amount a dealer quotes a buyer for a specific product, such as a one ounce American Gold Eagle coin or a ten ounce silver bar. The ask price includes the spot reference plus the dealer markup, the minting premium, the cost to distribute, and any promotional change the dealer applies that day.',
      ),
    ),
    block(
      'retail-2',
      p(
        'The gap between the spot price and the retail ask is the dealer spread, often shown in percent terms. On a common bullion coin, the spread might be three to eight percent above the wholesale quote. On a numismatic or semi-numismatic product, the spread can be much wider, at times thirty percent or more above the metal value. The product type and the dealer both drive the number.',
      ),
    ),
    block(
      'callout-spread',
      callout(
        'warning',
        'A buyer who expects to pay the headline spot price on the dashboard will find the real retail price clearly higher on every order. The gap is not an error. It is the dealer spread, which pays the dealer for fabrication, distribution, storage, and margin.',
      ),
    ),
    block('h2-why-difference-matters', h2('Why the difference matters')),
    block(
      'matters-1',
      p(
        'A long-term saver who is weighing a purchase should know the spread before the order closes. A buy-side spread above spot is what the saver must overcome before a position turns a profit, even if the spot price itself rises. A three percent spread is made back as soon as the spot price climbs three percent. A thirty percent spread requires the spot price to rise thirty percent before the saver simply breaks even.',
      ),
    ),
    block(
      'matters-2',
      p(
        'The sell-side spread works the same way in reverse. When a saver later sells the metal back to a dealer, the dealer quote will sit below the spot price by another margin. The full round-trip cost of buying and later selling a physical position is the sum of the buy-side and the sell-side spreads. The dashboard shows the wholesale quote. The written estimate shows the real deal price.',
      ),
    ),
    block('h2-historical', h2('Why historical charts matter for analysis')),
    block('h3-trends', h3('Spotting longer-term trends')),
    block(
      'trends-1',
      p(
        'The historical chart lets a saver track the spot price across recent weeks, months, or years. A short window shows day-to-day movement. A longer window shows if the market is trending up, down, or sideways. Both views help the saver decide whether to buy now, add to a position, or wait.',
      ),
    ),
    block('h3-volatility', h3('Measuring realized volatility')),
    block(
      'volatility-1',
      p(
        'Historical data also gives a rough read on realized volatility. A saver who looks at the chart across several years can see the typical range of price moves from peak to trough. This context matters because a buy made near a short-term peak has different effects than a buy made near a short-term trough, even if the long-term path is the same.',
      ),
    ),
    block('h3-context', h3('Placing current quotes in context')),
    block(
      'context-1',
      p(
        'A current spot quote means little on its own. The same quote might reflect a small premium or a large discount depending on the history around it. The chart places today quote next to the recent and distant past. That frame of reference is something a single headline number cannot give.',
      ),
    ),
    block('h2-practical', h2('How to use the dashboard')),
    block(
      'practical-1',
      p(
        'The dashboard is best used as the reference layer in a larger buying decision. Step one is checking the spot quote for the metal of interest. Step two is looking at the historical chart across the time window that matters. Step three is getting a dealer quote on the specific product you want. Step four is taking the spot reference away from the dealer quote to find the real spread.',
      ),
    ),
    block(
      'practical-2',
      p(
        'A careful buyer uses all four steps before sending money. The dashboard alone tells the saver what the wholesale market is doing. A written dealer estimate alone tells the saver what a specific product costs. Pulling both sources together gives a full picture of the economics of the deal.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'Is the spot price the price I will pay for a physical coin?',
        'No. The spot price is the wholesale quote for an ounce of metal between large firms. The retail ask price on a coin includes the spot reference plus the dealer markup, the minting premium, the cost to distribute, and any promotional change. The retail price will always be clearly above spot.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'How often does the spot price update on the dashboard?',
        'The dashboard refreshes the spot quote on a frequent interval during global trading hours, which run nearly all day on weekdays. The exact refresh pace depends on the upstream data feed. The historical chart is updated once a day after the trading session closes.',
      ),
    ),
    block(
      'faq-3',
      faq(
        'Why does one dealer show a higher price than another at the same spot?',
        'Different dealers apply different markup rules on different products. A bullion coin from one dealer might carry a five percent spread while the same coin from another carries an eight percent spread. Numismatic products vary far more widely. The spot dashboard is the common reference. The dealer quote is where the variation shows up.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'Is the spot price the price I will pay for a physical coin?',
      answer:
        'No. The spot price is the wholesale benchmark between institutional counterparties. The retail ask price on a physical coin includes the spot reference plus the dealer markup, the minting premium, the distribution cost, and any promotional adjustment. The retail price will always be meaningfully above spot.',
    },
    {
      question: 'How often does the spot price update on the dashboard?',
      answer:
        'The dashboard refreshes the spot quote on a frequent interval during global trading hours, which run nearly continuously on weekdays. Exact refresh cadence depends on the upstream data feed. The historical chart is updated on a daily cadence once the trading session closes.',
    },
    {
      question: 'Why does one dealer show a higher price than another at the same spot?',
      answer:
        'Different dealers apply different markup structures on different product categories. A bullion coin from one dealer might carry a five percent spread while the same coin from another carries an eight percent spread. The spot dashboard is the common reference and the individual dealer quote is where the variation appears.',
    },
  ],
}
