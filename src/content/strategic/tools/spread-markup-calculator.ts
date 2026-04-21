import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, h3, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.tools.spread-markup-calculator',
  pillar: 'tools',
  slug: 'spread-markup-calculator',
  title: 'Precious Metals Dealer Spread and Markup Calculator',
  summary:
    'A step-by-step guide to calculating the markup a dealer charges above spot on a quoted physical precious metals product, with a worked example a reader can follow by hand.',
  metaTitle: 'Dealer Spread and Markup Calculator',
  metaDescription:
    'Calculate the markup above spot on a dealer quote for a physical metal product. Follow the step-by-step procedure and worked example.',
  schemaJsonLdType: 'HowTo',
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
        'The spread and markup calculator answers a narrow but important question. How much is a dealer charging above the wholesale spot price on the specific physical product being quoted? The tool automates the math, but the procedure itself can be followed by hand with a spot quote, a dealer quote, and a simple division step. This page walks through every step so a reader can do the calculation without the tool.',
      ),
    ),
    block('h2-procedure', h2('The four-step calculation procedure')),
    block('h3-step-1', h3('Step one: look up the current spot price')),
    block(
      'step-1',
      p(
        'Start by locating the current spot price for the metal in question. Gold is quoted in dollars per troy ounce. Silver, platinum, and palladium are also quoted in dollars per troy ounce. The spot price dashboard on this site is one reference. The public page of any major financial data provider works the same way. Write down the exact spot quote at the moment of calculation.',
      ),
    ),
    block('h3-step-2', h3('Step two: calculate the intrinsic metal value')),
    block(
      'step-2',
      p(
        'Multiply the spot price by the weight of metal in the product. A one ounce coin uses a multiplier of one. A ten ounce bar uses a multiplier of ten. A fractional coin such as a quarter ounce uses a multiplier of zero point two five. The result is the intrinsic dollar value of the metal content in the product at the moment of the spot quote.',
      ),
    ),
    block(
      'h3-step-3',
      h3('Step three: subtract intrinsic value from the dealer quote'),
    ),
    block(
      'step-3',
      p(
        'Take the dealer quoted price for the product. Subtract the intrinsic metal value calculated in step two. The resulting number is the dollar markup that the dealer is charging above the wholesale metal content. The dollar markup is useful on its own as an absolute figure. It becomes more useful when converted into a percentage.',
      ),
    ),
    block(
      'h3-step-4',
      h3('Step four: convert the dollar markup into a percentage'),
    ),
    block(
      'step-4',
      p(
        'Divide the dollar markup by the intrinsic metal value from step two. Multiply the result by one hundred. The resulting percentage represents the markup above spot. A percentage allows a reader to compare markups across different products, different weights, and different dealers on a common scale.',
      ),
    ),
    block('h2-example', h2('A worked example from start to finish')),
    block(
      'example-1',
      p(
        'Consider a one ounce American Gold Eagle coin quoted by a dealer at two thousand four hundred dollars. Assume the current spot price for gold is two thousand two hundred dollars per ounce at the moment of the quote. Apply the four-step procedure to calculate the markup.',
      ),
    ),
    block(
      'example-2',
      p(
        'Step one. The spot price is two thousand two hundred dollars per ounce. Step two. The coin weighs one ounce, so the intrinsic metal value equals two thousand two hundred dollars. Step three. Subtract two thousand two hundred from the dealer quote of two thousand four hundred. The dollar markup equals two hundred dollars. Step four. Divide two hundred by two thousand two hundred. The result is zero point zero nine one, which is nine point one percent.',
      ),
    ),
    block(
      'callout-example',
      callout(
        'info',
        'Worked example summary. A one ounce Gold Eagle quoted at two thousand four hundred dollars when spot is two thousand two hundred dollars carries a markup of two hundred dollars, or nine point one percent above the spot reference.',
      ),
    ),
    block('h2-interpret', h2('How to interpret the markup number')),
    block(
      'interpret-1',
      p(
        'A markup number has no meaning in isolation. The reader needs a comparison to know whether a given number is reasonable, modest, or excessive. Bullion coins from government mints typically carry markups in the three to eight percent range at major dealers. A markup meaningfully above that range signals either a premium product category or a wider dealer margin.',
      ),
    ),
    block(
      'interpret-2',
      p(
        'Numismatic and semi-numismatic coins typically carry much wider markups. These products are sold on the basis of rarity, grade, and collector demand rather than on the basis of metal weight. A markup of twenty or thirty percent is common in the numismatic category. A markup of forty percent or more warrants careful investigation before a purchase closes.',
      ),
    ),
    block(
      'interpret-3',
      p(
        'The same calculation applied to the sell side reveals the dealer buy-back spread. A dealer who buys back a coin at nineteen hundred dollars when spot is two thousand two hundred dollars is paying a negative spread of roughly fourteen percent below spot. The combined round-trip cost of the purchase and the eventual sale is the sum of both spreads.',
      ),
    ),
    block('h2-use-cases', h2('Practical use cases for the calculation')),
    block(
      'use-1',
      p(
        'The calculation is useful for comparing two dealer quotes on the same product. Different dealers may quote meaningfully different prices on the same coin at the same moment. Running the four-step procedure on each quote reveals which dealer is charging a tighter spread and which is charging a wider one.',
      ),
    ),
    block(
      'use-2',
      p(
        'The calculation is also useful for comparing two different products from the same dealer. A Gold Eagle and a Gold Buffalo may carry different markups even though both contain one troy ounce of gold. The spread calculation puts both products on a common percentage basis for direct comparison.',
      ),
    ),
    block(
      'use-3',
      p(
        'Finally, the calculation provides a check on promotional offers. A promotion advertising a coin at spot plus a low premium should produce a low number when the four-step procedure is applied. A promotion that claims a low premium but produces a high number under the calculation is worth investigating further before a purchase.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'Does the spread already include shipping and insurance?',
        'Not always. Some dealer quotes include shipping and insurance in the headline price. Others add them at checkout. Before running the calculation, confirm whether the quoted price is an all-in figure or a base price with add-on charges. The four-step procedure works the same way either way.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'What markup should I expect on a common bullion coin?',
        'Bullion coins from government mints typically carry markups in the three to eight percent range at major dealers during normal market conditions. The exact number varies with the product, the dealer, and current market conditions. A markup clearly outside that band deserves a closer look.',
      ),
    ),
    block(
      'faq-3',
      faq(
        'Should I avoid coins with high markups?',
        'Not necessarily. A high markup simply means more of the purchase price is attributable to something other than metal weight. That something may be rarity, mint condition, or collector demand. The number is a signal to ask more questions, not an automatic reason to decline a purchase.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'Does the spread already include shipping and insurance?',
      answer:
        'Not always. Some dealer quotes include shipping and insurance in the headline price. Others add them at checkout. Before running the calculation, confirm whether the quoted price is an all-in figure or a base price with add-on charges. The four-step procedure works the same way either way.',
    },
    {
      question: 'What markup should I expect on a common bullion coin?',
      answer:
        'Bullion coins from government mints typically carry markups in the three to eight percent range at major dealers during normal market conditions. The exact number varies with the product, the dealer, and current market conditions. A markup clearly outside that band deserves a closer look.',
    },
    {
      question: 'Should I avoid coins with high markups?',
      answer:
        'Not necessarily. A high markup simply means more of the purchase price is attributable to something other than metal weight. That something may be rarity, mint condition, or collector demand. The number is a signal to ask more questions, not an automatic reason to decline a purchase.',
    },
  ],
}
