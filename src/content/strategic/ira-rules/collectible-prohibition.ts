import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.ira-rules.collectible-prohibition',
  pillar: 'ira-rules',
  slug: 'collectible-prohibition',
  title: 'IRC Section 408(m): The Collectible Prohibition',
  summary:
    'How Internal Revenue Code Section 408(m) classifies collectibles, what happens if one lands inside an IRA, and the common coins that fail the rule.',
  metaTitle: 'IRC Section 408(m): The Collectible Prohibition',
  metaDescription:
    'How IRC Section 408(m) treats rare coins, gems, and numismatics in an IRA. Buying one triggers an immediate taxable distribution and possible penalty.',
  schemaJsonLdType: 'FAQPage',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: [
    'ira-rules/eligible-metals',
    'accountability/bullion-vs-numismatic',
  ],
  citations: [citation('irc-408m'), citation('irs-590a')],
  body: [
    block(
      'intro',
      p(
        'The tax code draws a hard line between bullion and collectibles. Internal Revenue Code Section 408(m) is the statute that draws it. The rule matters because the penalty for getting it wrong is not a fine or a warning. The penalty is that the IRS treats the purchase as a distribution from your retirement account. You pay income tax on the value, and you may owe a 10 percent additional tax if you are under age 59 and a half.',
      ),
    ),
    block('h2-what', h2('What Section 408(m) actually says')),
    block(
      '408m-1',
      p(
        'Section 408(m) lists items that an IRA cannot hold. The list includes artwork, rugs, antiques, gems, stamps, alcoholic beverages, and most coins. The statute then carves out an exception for certain coins and bullion that meet fineness rules. Anything outside the carve-out is a collectible for IRA purposes.',
      ),
    ),
    block(
      '408m-2',
      p(
        'The carve-out is narrow. Gold must be at least 99.5 percent pure. Silver must be at least 99.9 percent pure. Platinum and palladium must be at least 99.95 percent pure. The American Gold Eagle is named by statute and is allowed at 91.67 percent pure. Coins or bars that fall outside these limits are collectibles, even when they carry a face value or a mint mark.',
      ),
    ),
    block('h2-penalty', h2('What happens when a collectible enters an IRA')),
    block(
      'penalty-1',
      p(
        'The tax code does not care how the collectible got into the account. A purchase, a transfer, or a gift all count the same. The moment an IRA acquires a collectible, the IRS treats the cost as a distribution to the account owner. The distribution is taxed as ordinary income at your marginal rate.',
      ),
    ),
    block(
      'penalty-2',
      p(
        'If you are under age 59 and a half, a 10 percent additional tax applies on top of the income tax. Section 72(t) of the tax code sets this penalty. The combined bill can easily reach 35 to 45 percent of the purchase price in the first year.',
      ),
    ),
    block(
      'callout-penalty',
      callout(
        'warning',
        'The Section 408(m) penalty is not a slow audit risk. It is an automatic event at the moment of purchase. The custodian is required to report the distribution on Form 1099-R for that tax year.',
      ),
    ),
    block('h2-common', h2('Common coins that fail the rule')),
    block(
      'pre1933',
      p(
        'Pre-1933 United States gold coinage is the most common trap. The Saint-Gaudens Double Eagle, the Liberty Head Double Eagle, and the Indian Head Eagle were all struck at 90 percent pure gold. That is .900 fine, which is below the .995 rule. These coins are beautiful and they hold numismatic value. They do not belong in an IRA.',
      ),
    ),
    block(
      'krugerrand',
      p(
        'The South African Krugerrand is the second common trap. It is struck at 91.67 percent pure gold, or .9167 fine. That is below the .995 rule and the coin has no statutory carve-out. It is a collectible for IRA purposes.',
      ),
    ),
    block(
      'graded',
      p(
        'Graded coins raise a separate concern. A coin that is otherwise eligible, such as an American Silver Eagle, can lose its eligibility when a grading service slabs it and assigns a numismatic premium. Some custodians accept graded bullion and some do not. When in doubt, the plain, ungraded coin is the safer choice.',
      ),
    ),
    block('h2-beyond', h2('Beyond coins: other collectibles')),
    block(
      'beyond-1',
      p(
        'Section 408(m) reaches past coins. Artwork, antique furniture, wine, rugs, and vintage cars are all on the list. Gems and precious stones are on the list as well. An IRA cannot hold these items, no matter how they are stored or how they are titled.',
      ),
    ),
    block(
      'beyond-2',
      p(
        'Precious metal jewelry is a gray area that tilts toward disallowed. The metal content may be pure enough, but the work and the wearability give the piece a collectible character. Custodians generally refuse jewelry, and the IRS has not published a safe harbor for it.',
      ),
    ),
    block('h2-compliance', h2('How compliant accounts avoid the trap')),
    block(
      'compliance-1',
      p(
        'A compliant precious metals IRA pairs three parties. The dealer sells bullion to the account. The self-directed custodian records the purchase and takes legal title on behalf of the IRA. An approved depository stores the metal in a vault. No coin or bar passes through the account holder at any point in the chain. When the paperwork is clean and the metal is bullion-grade, Section 408(m) never fires.',
      ),
    ),
    block(
      'compliance-2',
      p(
        'Before a purchase closes, a careful buyer should ask for the fineness mark on the coin or bar, the refiner or mint name, and a written confirmation from the custodian that the item is on its approved list. Keep the invoice and the custodian statement in a single folder. If the IRS later questions the purchase, these documents are the first line of defense.',
      ),
    ),
    block(
      'compliance-3',
      p(
        'If a collectible has already entered an account by mistake, the remedy is narrow. The IRS does not offer a clean rollback. Speak with a tax professional about a corrective distribution or a same-year sale at fair market value. Time matters. The earlier the fix, the smaller the tax exposure.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'What does IRC Section 408(m) prohibit?',
        'It prohibits an IRA from holding collectibles, including most coins, artwork, gems, and antiques. A narrow carve-out allows bullion and specific coins that meet fineness rules.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'What is the tax cost of putting a collectible in an IRA?',
        'The IRS treats the purchase price as a distribution to the account owner. You pay ordinary income tax on that amount, plus a 10 percent additional tax if you are under age 59 and a half.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'What does IRC Section 408(m) prohibit?',
      answer:
        'It prohibits an IRA from holding collectibles, including most coins, artwork, gems, and antiques. A narrow carve-out allows bullion and specific coins that meet fineness rules.',
    },
    {
      question: 'What is the tax cost of putting a collectible in an IRA?',
      answer:
        'The IRS treats the purchase price as a distribution to the account owner. You pay ordinary income tax on that amount, plus a 10 percent additional tax if you are under age 59 and a half.',
    },
  ],
}
