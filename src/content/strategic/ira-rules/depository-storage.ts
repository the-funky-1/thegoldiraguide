import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, h2, h3, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.ira-rules.depository-storage',
  pillar: 'ira-rules',
  slug: 'depository-storage',
  title: 'IRS-Approved Depositories for Precious Metals IRAs',
  summary:
    'How approved depositories hold IRA metals, the difference between segregated and non-segregated vaulting, and the legal criteria a facility must meet.',
  metaTitle: 'IRS-Approved Depositories for Precious Metals IRAs',
  metaDescription:
    'How segregated and non-segregated vault storage work for a precious metals IRA, and what a facility must meet to hold IRA assets under IRS rules.',
  schemaJsonLdType: 'Guide',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: ['ira-rules/eligible-metals', 'ira-rules/home-storage-fallacy'],
  citations: [citation('irs-590a'), citation('irc-408m')],
  body: [
    block(
      'intro',
      p(
        'A precious metals IRA does not live in a safe at home. It lives in a vault run by an outside facility that meets the standards set by the federal tax code. These facilities are called depositories, and they are the backbone of any compliant account. This guide covers how depositories work, the two vault models that appear on a statement, and what separates an approved depository from a private storage room.',
      ),
    ),
    block('h2-chain', h2('The chain of custody')),
    block(
      'chain-1',
      p(
        'Every compliant purchase follows the same path. A dealer sells coins or bars to the IRA. The self-directed custodian records the purchase and holds legal title on behalf of the account. The depository receives the metal and places it inside a vault under the custodian name.',
      ),
    ),
    block(
      'chain-2',
      p(
        'Three parties, three jobs, three signatures on the record. The dealer makes the sale. The custodian handles the tax paperwork. The depository handles the physical metal. The account holder never takes personal receipt. That separation is what keeps the account compliant.',
      ),
    ),
    block(
      'callout-chain',
      callout(
        'info',
        'The chain of custody is not a suggestion. Any break in the chain, including a brief delivery to the account holder, can convert the purchase into a taxable distribution.',
      ),
    ),
    block('h2-models', h2('Segregated vs non-segregated vaulting')),
    block('segregated-h3', h3('Segregated (allocated) storage')),
    block(
      'segregated-1',
      p(
        'Segregated storage places your specific coins and bars on a dedicated shelf, pallet, or cage. The assets are tagged with your custodian account number and serial numbers are recorded when the metal carries them. When you later take a distribution or sell back, you receive the exact same bars you bought.',
      ),
    ),
    block(
      'segregated-2',
      p(
        'Segregated storage costs more. You pay for the dedicated space and for the tracking overhead. The tradeoff is clarity. There is no pooling. Each piece is yours, on paper and in the vault.',
      ),
    ),
    block('nonseg-h3', h3('Non-segregated (commingled) storage')),
    block(
      'nonseg-1',
      p(
        'Non-segregated storage pools your metal with other client holdings of the same type and fineness. The depository owes you a specific weight of a specific grade. It does not owe you a specific coin by serial number. When you take a distribution, you receive equivalent metal from the pool.',
      ),
    ),
    block(
      'nonseg-2',
      p(
        'Non-segregated storage is cheaper. The facility uses vault space more densely and tracks a ledger rather than individual cages. For a buyer who sees bullion as a fungible asset, the cost savings can be worth the pooled handling.',
      ),
    ),
    block('h2-insurance', h2('Insurance and tracking')),
    block(
      'ins-1',
      p(
        'An approved vault carries all-risk insurance on the metal it holds. The policy is often written through Lloyds of London or a like market. The cover pays the replacement value of the metal if it is lost, stolen, or damaged. The custodian can share the policy on request.',
      ),
    ),
    block(
      'ins-2',
      p(
        'Tracking is done with a matched ledger. The custodian keeps a record of what the IRA owns. The vault keeps a record of what is in the room. The two records are checked on a set cycle. Any gap is flagged before the next statement goes out.',
      ),
    ),
    block('h2-facilities', h2('Major U.S. depositories')),
    block(
      'facilities',
      p(
        'A few vaults serve the self-directed IRA market. Delaware Depository sits in Wilmington and is one of the older private vaults in the trade. Brink’s Global Services runs vaults in several U.S. cities under the long-standing Brink’s brand. Texas Precious Metals Depository runs a state-chartered vault near Austin. International Depository Services runs vaults in Delaware and Ontario.',
      ),
    ),
    block(
      'facilities-note',
      p(
        'This list is neutral, not a pick. A custodian will share the vaults it uses. Prices, vault sites, and insurance terms vary, so it pays to compare them on your statement.',
      ),
    ),
    block('h2-criteria', h2('Legal criteria a facility must meet')),
    block(
      'criteria-intro',
      p(
        'The tax code does not issue one federal license for IRA vaults. It sets a group of rules a vault must meet. A vault that holds IRA metal should meet each of these rules.',
      ),
    ),
    block(
      'criteria-1',
      p(
        'First, the vault must be a non-bank trustee or work under one. This ties back to the trustee rules in the tax code.',
      ),
    ),
    block(
      'criteria-2',
      p(
        'Second, the vault must carry all-risk insurance sized to the value of the metal it holds. The policy should come from a known carrier. The cover should include theft, fire, and transit.',
      ),
    ),
    block(
      'criteria-3',
      p(
        'Third, the depository must allow independent audits. External auditors visit the vault, count the metal by serial number when possible, and match the count against the custodian ledger. The audit schedule is typically annual, with unannounced spot checks in between.',
      ),
    ),
    block(
      'criteria-4',
      p(
        'Fourth, the vault must keep IRA assets on a record apart from its own books. This is a bankruptcy rule. If the vault fails, the IRA metal is safe because it was never on the vault balance sheet.',
      ),
    ),
    block(
      'criteria-5',
      p(
        'Fifth, the vault must give a written storage pact. The pact should list the fees, the storage model, the audit cycle, and the steps for a withdrawal. The custodian keeps a copy. The account holder can ask for one.',
      ),
    ),
    block(
      'callout-criteria',
      callout(
        'warning',
        'A private safe, a bank safe-deposit box, or a home vault does not meet these criteria. Using one to hold IRA metal is not a storage choice. It is a distribution event.',
      ),
    ),
  ],
  faqs: [],
}
