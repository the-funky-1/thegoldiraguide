import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, h3, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.tools.rmd-estimator',
  pillar: 'tools',
  slug: 'rmd-estimator',
  title: 'Gold IRA Required Minimum Distribution Estimator',
  summary:
    'Required minimum distribution rules under SECURE 2.0 for a precious metals IRA, with a plain-language walkthrough of age thresholds, in-kind distributions, and the estimator tool.',
  metaTitle: 'Gold IRA Required Minimum Distribution Tool',
  metaDescription:
    'RMD rules under SECURE 2.0 for a precious metals IRA. Age thresholds, in-kind distributions, and how the estimator tool works.',
  schemaJsonLdType: 'Guide',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: [
    'ira-rules/rollover-mechanics',
    'economics/capital-gains-non-ira',
  ],
  citations: [citation('secure-2'), citation('irs-590b')],
  body: [
    block(
      'intro',
      p(
        'An RMD is the smallest amount the IRS requires a saver to pull out of a Traditional retirement account each year once the saver hits a set age. Roth IRAs owned by the first saver are not subject to RMDs during that saver lifetime. Traditional IRAs, including precious metals IRAs, are subject to the rule.',
      ),
    ),
    block(
      'intro-2',
      p(
        'The rmd tool helps a saver guess the yearly amount based on the year end balance and the age of the saver. This page covers the age rules under SECURE 2.0, the way in-kind payouts of metal work, and the reasons a saver should still talk to a qualified tax pro before any payout is taken.',
      ),
    ),
    block('h2-ages', h2('Age thresholds under SECURE 2.0')),
    block(
      'ages-1',
      p(
        'The SECURE 2.0 Act of 2022 changed the age at which a saver must start taking RMDs. The new rule works in two stages. A saver born between nineteen fifty one and nineteen fifty nine falls under an age seventy three rule. The first RMD must be taken for the year the saver turns seventy three.',
      ),
    ),
    block(
      'ages-2',
      p(
        'A saver born in nineteen sixty or later falls under an age seventy five rule, which starts in the year two thousand thirty three. The first RMD for that group must be taken for the year the saver turns seventy five. The change is written into the statute and does not need fresh rulemaking to take effect.',
      ),
    ),
    block(
      'callout-ages',
      callout(
        'info',
        'SECURE 2.0 age thresholds. Age seventy three applies to savers born between nineteen fifty one and nineteen fifty nine. Age seventy five applies to savers born in nineteen sixty or later, beginning in two thousand thirty three.',
      ),
    ),
    block('h2-calc', h2('How the estimator calculates the yearly amount')),
    block(
      'calc-1',
      p(
        'The basic RMD math uses two inputs. The first is the account balance as of December thirty first of the prior year. The second is the payout period from the IRS Uniform Lifetime Table, which drops each year as the saver gets older. The yearly RMD equals the prior year end balance divided by the payout period for the current age.',
      ),
    ),
    block(
      'calc-2',
      p(
        'The payout period for age seventy three is about twenty six point five years under the current table. The period for age seventy five is about twenty four point six years. These numbers change slightly when the IRS updates the table. The tool uses the most recent values.',
      ),
    ),
    block('h2-in-kind', h2('In-kind distributions of physical metal')),
    block('h3-what', h3('What an in-kind distribution means')),
    block(
      'in-kind-1',
      p(
        'An in-kind payout moves the metal itself out of the retirement account and into the hands of the saver, rather than a sale of the metal followed by a cash transfer. The saver gets the coins or bars from the depository. The payout is valued at the fair market value of the metal on the payout date.',
      ),
    ),
    block('h3-tax', h3('The tax treatment of an in-kind payout')),
    block(
      'in-kind-2',
      p(
        'An in-kind payout from a Traditional IRA is a taxable event. The fair market value of the metal on the payout date is added to the ordinary income of the saver for that tax year. The tax treatment is the same as a cash payout of the same dollar amount. The saver now holds metal outside the retirement wrapper. Any future gain or loss is measured from the payout date value as the new cost basis.',
      ),
    ),
    block('h3-liquidate', h3('Selling within the IRA as a path')),
    block(
      'in-kind-3',
      p(
        'The other path is to tell the custodian to sell the metal inside the retirement account and send out cash. The saver never takes delivery of the coins or bars. The cash payout is added to ordinary income in the same way. The choice between the two paths depends on whether the saver wants to keep holding the metal outside the retirement wrapper or prefers to end the position.',
      ),
    ),
    block('h2-timing', h2('Timing rules and the first-year exception')),
    block(
      'timing-1',
      p(
        'RMDs must usually be taken by December thirty first of each year. The first RMD offers a one-time option. A saver may delay the first RMD until April first of the next year, which is the required start date. Delaying the first RMD pushes two payouts into the same tax year, which can raise the tax rate on the combined amount.',
      ),
    ),
    block(
      'timing-2',
      p(
        'The penalty for missing an RMD under SECURE 2.0 is a tax equal to twenty five percent of the amount that should have been paid out. It is cut to ten percent if the shortfall is fixed in a timely way. The older fifty percent penalty that applied before SECURE 2.0 has been retired. A missed RMD is still costly, and the lower rate is not a green light to ignore the deadline.',
      ),
    ),
    block('h2-tool-use', h2('How to use the estimator')),
    block(
      'tool-1',
      p(
        'The tool takes the prior year end balance and the current age of the saver. It returns the rough dollar amount of the yearly RMD and shows the payout period it used. The result is a planning estimate, not a final tax figure. Fair market value on the actual payout date may differ from the prior year end balance, since the spot price moves daily.',
      ),
    ),
    block(
      'tool-2',
      p(
        'A saver should run the tool each year a few months before the deadline. This leaves time to work with the custodian on either an in-kind payout or a cash sale. Custodians often need written steps several weeks ahead of the December deadline. A saver who waits until late in the year may face slowdowns.',
      ),
    ),
    block('h2-professional', h2('When to consult a tax professional')),
    block(
      'professional-1',
      p(
        'The tool is a planning aid, not a stand-in for qualified tax advice. A saver with several retirement accounts, a working spouse, a recent inheritance, or an unusual payout history should talk with a qualified tax pro before any RMD is taken. The overlap between retirement payouts and other tax rules can surprise a saver who relies only on the simple table math.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'At what age must I start taking RMDs from my precious metals IRA?',
        'Under SECURE 2.0, the age is seventy three for savers born between nineteen fifty one and nineteen fifty nine. For savers born in nineteen sixty or later, the age rises to seventy five starting in two thousand thirty three. Roth IRAs are not subject to RMDs during the original owner lifetime.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'Can I take my RMD as physical metal instead of cash?',
        'Yes. An in-kind distribution moves the coins or bars out of the depository and into your own hands. The fair market value on the distribution date is added to your ordinary income for that tax year, the same as a cash distribution. The choice depends on whether you want to keep holding the metal outside the retirement wrapper.',
      ),
    ),
    block(
      'faq-3',
      faq(
        'What happens if I miss the RMD deadline?',
        'SECURE 2.0 applies a twenty five percent penalty on the amount that should have been distributed. It is cut to ten percent if the shortfall is fixed in a timely manner. The prior fifty percent penalty has been retired. A missed RMD is still costly, so the lower rate is not a green light to ignore the deadline.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'At what age must I start taking RMDs from my precious metals IRA?',
      answer:
        'Under SECURE 2.0, the threshold is age seventy three for savers born between nineteen fifty one and nineteen fifty nine. For savers born in nineteen sixty or later, the threshold rises to age seventy five starting in two thousand thirty three. Roth IRAs are not subject to RMDs during the original owner lifetime.',
    },
    {
      question: 'Can I take my RMD as physical metal instead of cash?',
      answer:
        'Yes. An in-kind distribution transfers the physical coins or bars out of the depository and into your personal possession. The fair market value on the distribution date is added to your ordinary income for that tax year, the same as a cash distribution.',
    },
    {
      question: 'What happens if I miss the RMD deadline?',
      answer:
        'SECURE 2.0 applies a twenty five percent penalty on the amount that should have been distributed, reduced to ten percent if the shortfall is corrected in a timely manner. The prior fifty percent penalty has been retired. A missed RMD is still expensive.',
    },
  ],
}
