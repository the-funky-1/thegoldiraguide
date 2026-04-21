import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.ira-rules.eligible-metals',
  pillar: 'ira-rules',
  slug: 'eligible-metals',
  title: 'IRS Purity Standards for Precious Metals IRAs',
  summary:
    'A plain-English guide to the fineness rules gold, silver, platinum, and palladium must meet to sit inside a self-directed IRA.',
  metaTitle: 'IRS Purity Standards for Precious Metals IRAs',
  metaDescription:
    'The IRS fineness rules for gold, silver, platinum, and palladium inside a self-directed IRA, with a list of eligible bullion coins.',
  schemaJsonLdType: 'FAQPage',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: [
    'ira-rules/collectible-prohibition',
    'ira-rules/depository-storage',
    'accountability/bullion-vs-numismatic',
  ],
  citations: [
    citation('irs-590a'),
    citation('irc-408m'),
    citation('usc-31-5112'),
  ],
  body: [
    block(
      'intro',
      p(
        'The IRS does not let you put any coin or bar inside a retirement account. The metal must meet a purity floor. If it does not, the asset is treated as a collectible, and the tax code triggers a distribution. This guide walks through the four metals, the fineness rule for each, and the one coin that breaks the pattern by act of Congress.',
      ),
    ),
    block('h2-standards', h2('The four metals and their fineness floors')),
    block(
      'gold',
      p(
        'Gold must be 99.5 percent pure, which the market calls .995 fine. A one-ounce gold bar from an accredited refiner meets this floor. So does the Canadian Gold Maple Leaf, which is struck at .9999 fine. The Austrian Philharmonic clears the bar at .9999 as well.',
      ),
    ),
    block(
      'silver',
      p(
        'Silver must be 99.9 percent pure, or .999 fine. The American Silver Eagle is the most common coin used in IRAs. The Canadian Silver Maple Leaf is a frequent pick, too. Bars from approved refiners also qualify when they hit .999 or higher.',
      ),
    ),
    block(
      'platinum',
      p(
        'Platinum must be 99.95 percent pure, or .9995 fine. The American Platinum Eagle meets this rule. So does the Canadian Platinum Maple Leaf.',
      ),
    ),
    block(
      'palladium',
      p(
        'Palladium shares the same floor as platinum at .9995 fine. The Canadian Palladium Maple Leaf is the most common IRA-eligible palladium coin. Approved palladium bars are also allowed.',
      ),
    ),
    block(
      'callout-fineness',
      callout(
        'info',
        'Fineness is measured in thousandths. A .995 gold bar is 995 parts gold per 1,000 parts total. The small share of other metal is usually copper or silver, added for durability.',
      ),
    ),
    block('h2-examples', h2('Sovereign coins that qualify')),
    block(
      'sovereigns',
      p(
        'Several government-minted coins clear the purity rule with ease. The Canadian Gold Maple Leaf, the Austrian Philharmonic, and the Australian Kangaroo are all struck at .9999 fine gold. The American Silver Eagle is .999 fine silver. The Canadian Silver Maple Leaf is .9999 fine. These coins share two traits. They come from a national mint, and their weight and purity are backed by the issuing country.',
      ),
    ),
    block(
      'bars',
      p(
        'Bars from refiners on the LBMA or COMEX approved list also qualify. The bar must carry a stamped weight, a stamped fineness, and the refiner mark. A serial number on the bar is standard for one-kilogram pieces and larger. Smaller bars in sealed assay cards carry the same data on the card. A custodian will refuse any bar that lacks these markings, and will refuse any bar where the stamped data does not match the invoice.',
      ),
    ),
    block('h2-disqual', h2('Coins that fail the rule')),
    block(
      'krugerrand',
      p(
        'The South African Krugerrand is the classic example of a popular coin that does not qualify. The Krugerrand is struck at 91.67 percent gold, which is .9167 fine. That sits well below the .995 floor. The coin is legal to own, and many collectors hold it. It simply cannot live inside an IRA.',
      ),
    ),
    block(
      'pre1933',
      p(
        'Pre-1933 United States gold coinage, such as the Saint-Gaudens Double Eagle, also fails the purity rule. These coins were struck at .900 fine. The tax code treats them as collectibles when held in a retirement account.',
      ),
    ),
    block('h2-eagle', h2('The American Gold Eagle exception')),
    block(
      'eagle1',
      p(
        'The American Gold Eagle is 22-karat gold, or 91.67 percent pure. On paper it should fail the .995 rule. It does not. Congress wrote a carve-out for this coin in Title 31 of the U.S. Code, section 5112. That statute names the coin and sets its legal specifications.',
      ),
    ),
    block(
      'eagle2',
      p(
        'The IRS honors the carve-out. The American Gold Eagle is eligible for IRA ownership by statute. No other sub-.995 gold coin shares this treatment. A Krugerrand with the same purity is not allowed. The difference is not chemistry. The difference is a line of federal law.',
      ),
    ),
    block(
      'callout-eagle',
      callout(
        'warning',
        'The American Gold Eagle is the only sub-.995 gold coin that is IRA-eligible. Do not assume other 22-karat coins share this status. They do not.',
      ),
    ),
    block('h2-refiners', h2('Approved refiners and recordkeeping')),
    block(
      'refiners1',
      p(
        'A custodian will accept a bar only when the refiner appears on an approved assay list. The London Bullion Market Association publishes a Good Delivery list for gold and silver. The COMEX exchange maintains its own roster for deliverable bars. A bar from PAMP Suisse, Valcambi, Credit Suisse, or the Royal Canadian Mint will satisfy the paperwork test at most custodians.',
      ),
    ),
    block(
      'refiners2',
      p(
        'The IRS does not require a specific refiner. The tax code cares about purity and about who holds the metal. The approved-refiner lists are a practical convention the industry uses to prove purity. A bar without a recognized hallmark creates a documentation problem for the custodian, even when the underlying metal is pure.',
      ),
    ),
    block(
      'records',
      p(
        'Your custodian is required to track each coin or bar by serial number when possible, by weight, and by purity. This record is the backbone of IRS compliance during an audit. A missing or incomplete record is a red flag. Ask for the custodian statement each quarter and confirm the weights and fineness values match your purchase invoices.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'What purity does gold need to sit in an IRA?',
        'Gold must be at least 99.5 percent pure, or .995 fine. The American Gold Eagle is the single exception. It holds at 91.67 percent pure and is allowed by federal statute.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'Are pre-1933 U.S. gold coins allowed in an IRA?',
        'No. Pre-1933 U.S. gold coins were struck at .900 fine. That is below the .995 rule, so the IRS treats them as collectibles.',
      ),
    ),
    block(
      'faq-3',
      faq(
        'Is the South African Krugerrand allowed in an IRA?',
        'No. The Krugerrand is struck at .9167 fine gold. That is below the .995 rule, and the coin has no statutory carve-out. It is not IRA-eligible.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'What purity does gold need to sit in an IRA?',
      answer:
        'Gold must be at least 99.5 percent pure, or .995 fine. The American Gold Eagle is the single exception. It holds at 91.67 percent pure and is allowed by federal statute.',
    },
    {
      question: 'Are pre-1933 U.S. gold coins allowed in an IRA?',
      answer:
        'No. Pre-1933 U.S. gold coins were struck at .900 fine. That is below the .995 rule, so the IRS treats them as collectibles.',
    },
    {
      question: 'Is the South African Krugerrand allowed in an IRA?',
      answer:
        'No. The Krugerrand is struck at .9167 fine gold. That is below the .995 rule, and the coin has no statutory carve-out. It is not IRA-eligible.',
    },
  ],
}
