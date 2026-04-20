import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, h3, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.accountability.bullion-vs-numismatic',
  pillar: 'accountability',
  slug: 'bullion-vs-numismatic',
  title: 'Bullion vs Numismatic Coins: Pricing and Liquidity',
  summary:
    'How pricing and liquidity differ between sovereign bullion and numismatic coins, and why the distinction shapes the cost basis of a precious metals IRA.',
  metaTitle: 'Bullion vs Numismatic Coins: Pricing and Liquidity',
  metaDescription:
    'Sovereign bullion prices anchor to metal content. Numismatic prices depend on rarity and grading. See how each pricing model shapes real exit value.',
  schemaJsonLdType: 'Article',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: [
    'ira-rules/collectible-prohibition',
    'accountability/transactional-spreads',
  ],
  citations: [citation('irc-408m'), citation('finra-metals')],
  body: [
    block(
      'intro',
      p(
        'Bullion and numismatic coins look alike in a display case. They do not act the same way in a portfolio. Bullion is priced on its metal content. A numismatic coin is priced on a story. The two sit at different points on the cost and exit map. Mixing them leads to a cost basis the buyer cannot explain.',
      ),
    ),
    block(
      'intro-2',
      p(
        'This article is about the price math and the exit path. The tax code rules that decide which coins an IRA can hold are in a separate piece. Here the focus is what each type costs at purchase and what each type returns at sale.',
      ),
    ),
    block('h2-numismatic', h2('How numismatic coins are priced')),
    block(
      'numismatic-1',
      p(
        'A numismatic coin is priced on three factors. Rarity is how few of the coin still exist. Grading is the condition of this one coin, set on a seventy point scale by a third-party service. The third factor is the story. The mint year, the mint mark, and the setting all add to it.',
      ),
    ),
    block(
      'numismatic-2',
      p(
        'These factors produce premiums that can reach twenty percent to one hundred percent above the metal content. On famous dates or high-grade coins, premiums climb higher. The buyer pays for the story and the slab, not only for the ounce of metal inside the coin.',
      ),
    ),
    block(
      'numismatic-3',
      p(
        'The resale market for a numismatic coin leans on the same factors. A grade set today can shift when a second service reviews the coin. A story that is in demand this year can lose its premium next year. The exit price rests on the next buyer, not on the spot price of the metal.',
      ),
    ),
    block('h2-bullion', h2('How sovereign bullion is priced')),
    block(
      'bullion-1',
      p(
        'Sovereign bullion is priced on metal content. A one-ounce American Gold Eagle holds one ounce of fine gold. The price at purchase is the spot price of gold plus a small premium for minting, shipping, and the dealer. That premium usually sits between one and five percent on common one-ounce coins.',
      ),
    ),
    block(
      'bullion-2',
      p(
        'The resale market for sovereign bullion is steady. Any dealer can quote a bid based on the day spot price. The quote may move by a percent or two. It does not rest on a third-party view of the coin condition. A buyer who needs to sell can expect a clear process and a narrow spread.',
      ),
    ),
    block(
      'bullion-3',
      p(
        'Liquidity is the real-world result of that pricing model. Sovereign bullion has a deep market, live two-way quotes, and a simple exit. A numismatic coin has a thinner market, a price quoted by hand, and an exit that often waits on a second grading review.',
      ),
    ),
    block('h2-compare', h2('Side-by-side comparison')),
    block('h3-assettype', h3('Asset type')),
    block(
      'compare-type',
      p(
        'Sovereign bullion covers coins such as the American Gold Eagle, the Canadian Maple Leaf, and the Austrian Philharmonic. It also covers bars from known refiners. Numismatic coins cover graded and ungraded rarities, old issues, and small mintages that trade on collector demand.',
      ),
    ),
    block('h3-valuedriver', h3('Primary value driver')),
    block(
      'compare-driver',
      p(
        'Sovereign bullion gets its value from the metal content and a small minting premium. Numismatic coins get their value from rarity, grade, and story. Metal content sets a floor on a numismatic coin, but the market price can sit far above that floor.',
      ),
    ),
    block('h3-spread', h3('Average spread percentage')),
    block(
      'compare-spread',
      p(
        'Sovereign bullion trades at a one to five percent premium over spot on the ask side. The bid side sits at a close discount. Numismatic coins can trade at twenty percent or more over their melt value on purchase. The dealer buyback spread is wider still.',
      ),
    ),
    block(
      'callout-liquidity',
      callout(
        'info',
        'Bullion has a predictable exit. Numismatics depend on subjective grading. A buyer who plans to hold for a working career should understand which model applies to each coin on the invoice.',
      ),
    ),
    block('h2-ira-lens', h2('The IRA lens on this comparison')),
    block(
      'ira-1',
      p(
        'An IRA can hold sovereign bullion that meets the fineness rules. It can also hold certain sovereign coins named by statute. An IRA cannot hold most numismatic coins. A coin that is otherwise eligible can lose that status when a grading slab adds a numismatic premium. The pricing test becomes a rules test for retirement accounts.',
      ),
    ),
    block(
      'ira-2',
      p(
        'A buyer who holds numismatics outside a retirement account has a broader set of choices. A buyer who wants the tax treatment of an IRA should keep the coin list on the bullion side of the line. The written estimate should name each coin by type, year, and mint, so the category is clear on paper.',
      ),
    ),
    block('h2-practice', h2('How disciplined buyers apply the difference')),
    block(
      'practice-1',
      p(
        'Disciplined buyers start with the price anchor. They ask the dealer for the spot reference used, the premium in dollars, and the premium as a percentage of spot. On sovereign bullion, those three numbers produce a narrow range that a buyer can compare across several institutions in minutes.',
      ),
    ),
    block(
      'practice-2',
      p(
        'They treat numismatic premiums as a separate category of cost. If a coin is being offered at a numismatic premium, the sales presentation should justify that premium with evidence. Grading service reports, population figures, and independent price guides belong in that evidence. A story alone does not.',
      ),
    ),
    block(
      'practice-3',
      p(
        'They also plan the exit. A sovereign bullion holding can be sold on a Tuesday with a phone call. A numismatic holding may need a consignment, an auction, or a specialist dealer. The exit plan should exist before the purchase closes, not after.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'Can a numismatic coin be held in a precious metals IRA?',
        'Most cannot. The collectible prohibition in Internal Revenue Code Section 408(m) blocks numismatic coins from IRAs, with a narrow carve-out for certain bullion and specific sovereign coins. A graded slab on an otherwise eligible coin can push it out of eligibility.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'Why do numismatic coins carry higher spreads than bullion?',
        'The premium pays for rarity, grading, and historical narrative. Those factors are subjective and the resale market is thinner. Both conditions widen the gap between the bid and the ask price.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'Can a numismatic coin be held in a precious metals IRA?',
      answer:
        'Most cannot. The collectible prohibition in Internal Revenue Code Section 408(m) blocks numismatic coins from IRAs, with a narrow carve-out for certain bullion and specific sovereign coins.',
    },
    {
      question: 'Why do numismatic coins carry higher spreads than bullion?',
      answer:
        'The premium pays for rarity, grading, and historical narrative. Those factors are subjective and the resale market is thinner. Both conditions widen the gap between the bid and the ask price.',
    },
  ],
}
