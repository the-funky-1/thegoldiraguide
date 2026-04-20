import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, h2, h3, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.ira-rules.rollover-mechanics',
  pillar: 'ira-rules',
  slug: 'rollover-mechanics',
  title: 'Gold IRA Rollovers: Direct Transfers vs the 60-Day Rule',
  summary:
    'The two ways to move retirement funds into a precious metals IRA, the tax and timing rules that separate them, and the trade-offs for each path.',
  metaTitle: 'Gold IRA Rollovers: Direct Transfers vs the 60-Day Rule',
  metaDescription:
    'How a direct custodian-to-custodian transfer and a 60-day rollover differ on tax withholding, the once-per-year limit, and their main risks.',
  schemaJsonLdType: 'Guide',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: [
    'ira-rules/eligible-metals',
    'ira-rules/home-storage-fallacy',
  ],
  citations: [citation('irs-590a')],
  body: [
    block(
      'intro',
      p(
        'Moving money into a precious metals IRA is not a single act. The tax code lays out two paths. Each one has its own timing rules, its own tax withholding rules, and its own risk. The direct transfer is the quiet, safe path. The indirect 60-day rollover is the faster path that carries real penalty risk if a single step slips. This guide walks through both, side by side.',
      ),
    ),
    block('h2-direct', h2('The direct custodian-to-custodian transfer')),
    block(
      'direct-1',
      p(
        'A direct transfer moves money from one retirement account custodian to another without the account holder taking personal receipt. You sign a transfer request. Your current custodian sends funds or assets straight to the new custodian. At no point does a check land in your mailbox or a deposit hit your personal bank account.',
      ),
    ),
    block(
      'direct-2',
      p(
        'The tax code does not count a direct transfer as a distribution. No tax is withheld. No 60-day clock starts. The once-per-year rule that limits indirect rollovers does not apply. You can make as many direct transfers as your custodians allow in a single year.',
      ),
    ),
    block(
      'direct-3',
      p(
        'The common delay with a direct transfer is paperwork. The new custodian prepares a form. The old custodian reviews it, confirms the account details, and releases the funds. The full cycle can run from one to three weeks, depending on the two firms involved. The delay is an inconvenience, not a tax event.',
      ),
    ),
    block('h2-indirect', h2('The indirect 60-day rollover')),
    block(
      'indirect-1',
      p(
        'An indirect rollover sends the money to you first. The current custodian issues a check or a wire to the account holder. You then have 60 calendar days to redeposit the full amount into the new retirement account. If the redeposit lands on day 61, the IRS treats the funds as a distribution.',
      ),
    ),
    block(
      'indirect-2',
      p(
        'The 60-day rule is strict. Weekends count. Holidays count. A missed deadline converts the rollover into a taxable event for the full amount. Income tax applies at your marginal rate, and a 10 percent additional tax applies if you are under age 59 and a half.',
      ),
    ),
    block(
      'callout-withholding',
      callout(
        'warning',
        'An indirect rollover from an employer retirement plan has 20 percent federal tax withheld before the check leaves. To complete a full rollover, you must replace that 20 percent from other funds within 60 days. If you do not, the withheld amount is treated as a distribution.',
      ),
    ),
    block('h2-limits', h2('The once-per-year rule')),
    block(
      'limits-1',
      p(
        'The tax code limits an account holder to one indirect rollover per 12-month period across all IRAs. The limit was tightened in 2015 after a Tax Court ruling. Before that ruling, the once-per-year rule was applied per account. Now it is applied per taxpayer.',
      ),
    ),
    block(
      'limits-2',
      p(
        'A second indirect rollover in the same 12 months is treated as a distribution from the first IRA, regardless of whether the money later lands in a new IRA. The direct transfer path avoids this trap. Direct transfers are not capped.',
      ),
    ),
    block('h2-compare', h2('Direct vs indirect, side by side')),
    block('compare-withholding', h3('Tax withholding')),
    block(
      'compare-withholding-body',
      p(
        'Direct transfers have no tax withheld. The assets move between custodians at full value. Indirect rollovers from an employer plan have 20 percent withheld before the check is cut. The account holder must replace that 20 percent from a separate source within 60 days to complete a full rollover.',
      ),
    ),
    block('compare-limit', h3('Twelve-month limit')),
    block(
      'compare-limit-body',
      p(
        'Direct transfers are not subject to the once-per-year rule. You can move funds between custodians as often as you need to. Indirect rollovers are capped at one per taxpayer per 12 months across all IRAs, regardless of which account receives the funds.',
      ),
    ),
    block('compare-risk', h3('Primary risk')),
    block(
      'compare-risk-body',
      p(
        'The main risk of a direct transfer is a slow back office. That is an inconvenience. The main risk of an indirect rollover is the 60-day deadline. A missed deadline or a missed 20 percent redeposit creates a taxable distribution plus a possible 10 percent penalty. For most buyers, the direct path is the safer default.',
      ),
    ),
    block('h2-plan', h2('Moving money from an employer plan')),
    block(
      'plan-1',
      p(
        'A 401(k) or 403(b) rollover adds a wrinkle. The 20 percent federal withholding rule applies when the distribution is paid to the participant. A check made out to you, or a wire sent to your personal account, triggers the withholding the moment funds leave the plan. A direct rollover is treated differently. If the check is payable to the new custodian for the benefit of the account owner, no 20 percent is withheld. If you do take receipt, you have 60 days to redeposit the full amount, and you must replace the 20 percent from other funds to avoid taxing that portion as a distribution.',
      ),
    ),
    block(
      'plan-2',
      p(
        'A direct rollover from a 401(k) is coded differently on the Form 1099-R. The distribution code tells the IRS that the funds moved trustee-to-trustee. No withholding applies. No 60-day clock starts. The paperwork looks similar to a direct IRA transfer, and the tax result is the same.',
      ),
    ),
    block(
      'callout-plan',
      callout(
        'info',
        'When rolling from an employer plan, always ask for a direct rollover. The 20 percent withholding on an indirect rollover from a 401(k) can create a cash squeeze if you cannot cover the gap from other funds within 60 days.',
      ),
    ),
    block('h2-docs', h2('What to keep in your records')),
    block(
      'docs-1',
      p(
        'The paper trail for a rollover is your main defense during an IRS review. Save the transfer request form, the check or wire copy, and the receipt from the new custodian. Save the Form 1099-R from the sending institution and the Form 5498 from the receiving custodian. Those two forms should match the dollar amount and the rollover code.',
      ),
    ),
  ],
  faqs: [],
}
