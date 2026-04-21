import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, h2, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.ira-rules.home-storage-fallacy',
  pillar: 'ira-rules',
  slug: 'home-storage-fallacy',
  title: 'The Legal Realities of Home-Storage Gold IRAs',
  summary:
    'Why the trustee standards in IRC Section 408(a)(2) place home-storage gold IRAs out of reach for nearly every individual, and the tax cost of trying.',
  metaTitle: 'The Legal Realities of Home-Storage Gold IRAs',
  metaDescription:
    'How IRC Section 408(a)(2) trustee rules make home-storage gold IRAs unreachable for most individuals, and the tax cost of trying.',
  schemaJsonLdType: 'Article',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: [
    'ira-rules/depository-storage',
    'accountability/written-estimate',
  ],
  citations: [citation('irs-590a'), citation('irc-408m')],
  body: [
    block(
      'intro',
      p(
        'The home-storage gold IRA is an idea that will not go away. The pitch is simple. Set up a small company, name yourself trustee, and keep the coins at home. The tax code does not support this idea. The rules that govern who can serve as an IRA trustee are written into Internal Revenue Code Section 408(a)(2). This article walks through what those rules actually require, why almost no individual can meet them, and what happens when someone tries.',
      ),
    ),
    block('h2-rule', h2('What Section 408(a)(2) requires')),
    block(
      'rule-1',
      p(
        'The tax code names two kinds of entities that can serve as an IRA trustee. The first is a bank or an insurance company that meets federal or state chartering rules. The second is a non-bank trustee approved in writing by the IRS. For individuals, only the non-bank trustee path is even on the table.',
      ),
    ),
    block(
      'rule-2',
      p(
        'The non-bank trustee rule lives in Treasury Regulation 1.408-2(e). The rule sets a long list of standards that an applicant must meet before the IRS will grant approval. The standards cover net worth, fiduciary experience, accounting systems, audit procedures, asset segregation, and continuity of operations. The standards exist for a reason. A trustee holds retirement assets that Congress chose to give a tax shield. The trustee rules protect those assets.',
      ),
    ),
    block('h2-math', h2('Why the rules block most individuals')),
    block(
      'math-1',
      p(
        'The non-bank trustee rule requires a minimum net worth of 250,000 dollars at the time of the application. That figure appears in Treasury Regulation 1.408-2(e)(5)(ii). It is a starting point, not a ceiling. After approval, the trustee must maintain adequate net worth on an ongoing basis, and the required amount scales with the dollar value of assets held under trust. A household trustee holding a single IRA does not face this math once. The test is continuous, and the standard climbs as the account grows.',
      ),
    ),
    block(
      'math-2',
      p(
        'The rule also calls for a separate staff with fiduciary training, a written set of policies and procedures, annual independent audits, and evidence of adequate insurance. An individual storing gold in a home safe has none of this. A small limited liability company formed for this purpose has none of it either. The IRS does not grant trustee status because a box exists on a legal form.',
      ),
    ),
    block(
      'math-3',
      p(
        'In plain terms, the non-bank trustee regime is written for regulated firms, not for households. The IRS publishes a short public list of approved non-bank trustees. Every entry on the list is an institution with dedicated compliance staff. No entry on the list is a private individual.',
      ),
    ),
    block(
      'callout-rule',
      callout(
        'danger',
        'The IRS prohibits personal possession of IRA metals. Holding IRA coins or bars at home, in a private safe, or in a bank safe-deposit box is a distribution event at the moment of possession.',
      ),
    ),
    block('h2-cost', h2('The tax cost of personal possession')),
    block(
      'cost-1',
      p(
        'When an account holder takes personal possession of IRA metal, the tax code treats the fair market value of the metal as a distribution. The distribution is taxed as ordinary income at the marginal rate. If the account holder is under age 59 and a half, a 10 percent additional tax applies on top of the income tax.',
      ),
    ),
    block(
      'cost-2',
      p(
        'The tax is not the end of the matter. Personal possession of IRA assets is a marker that the IRS associates with heightened audit risk. Once the distribution is reported, the agency can examine the broader account for other issues. Past rollovers, prior purchases, and custodian choice may all come into review.',
      ),
    ),
    block(
      'cost-3',
      p(
        'There is also the question of proof. In a home-storage setup, the account holder is often the only witness to the storage chain. If an audit asks when the metal entered the home, the paper trail is thin. The burden of proof falls on the account holder, and the default is not in the account holder\u2019s favor.',
      ),
    ),
    block('h2-cases', h2('What the courts have said')),
    block(
      'cases-1',
      p(
        'The leading case on this question is McNulty v. Commissioner, decided by the United States Tax Court in 2021. The McNultys used a self-directed IRA to buy American Eagle coins and kept the coins at home in a safe. The Tax Court ruled that the couple had taken a taxable distribution of the entire value of the coins. The court also sustained a penalty.',
      ),
    ),
    block(
      'cases-2',
      p(
        'The McNulty decision is not a narrow ruling. It confirms the plain reading of Section 408. Physical possession of IRA metal by the account holder is a distribution. The form of the account, the name on the trustee line, and the intent of the owner do not change that result.',
      ),
    ),
    block('h2-path', h2('The compliant path')),
    block(
      'path-1',
      p(
        'The compliant path for precious metals in a retirement account has not changed since Congress wrote Section 408. An approved self-directed custodian holds legal title on behalf of the IRA. An approved depository stores the metal in a vault under the custodian name. The account holder reviews statements and directs purchases but does not take possession.',
      ),
    ),
    block(
      'path-2',
      p(
        'This path has a cost. Custodial fees and storage fees apply each year. The fees are the price of tax deferral on physical metal. Paying them keeps the account inside the rules. Skipping them, by holding metal at home, turns the account into an ordinary brokerage with an extra tax bill on top.',
      ),
    ),
    block(
      'conclusion',
      p(
        'The home-storage gold IRA is not a loophole. It is a path that looks like compliance on the surface and fails the moment the IRS asks for trustee paperwork. For almost every household, the cost of trying to thread the rule is much higher than the cost of using an approved depository. The approved depository is the only reliable path.',
      ),
    ),
  ],
  faqs: [],
}
