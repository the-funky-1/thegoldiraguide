import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, h3, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.economics.physical-vs-etfs',
  pillar: 'economics',
  slug: 'physical-vs-etfs',
  title: 'Physical Bullion vs Gold ETFs: A Counterparty View',
  summary:
    'A side-by-side look at physical metal and gold ETFs, with a focus on who holds what, which parties stand between the investor and the ounce, and the trade-offs of each path.',
  metaTitle: 'Physical Bullion vs Gold ETFs: A Counterparty View',
  metaDescription:
    'How gold ETFs differ from physical bullion on counterparty risk, storage, fees, and exit. A factual comparison for long-horizon savers.',
  schemaJsonLdType: 'Guide',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: [
    'economics/portfolio-volatility',
    'ira-rules/depository-storage',
  ],
  citations: [citation('finra-metals')],
  body: [
    block(
      'intro',
      p(
        'Gold can enter a portfolio in two main forms. A shareholder of a gold exchange-traded fund holds a regulated security. A buyer of physical bullion holds direct title to the metal. The two sit in the same asset class on an allocation chart. They do not carry the same structure underneath. This piece walks through that structure, with a focus on counterparty risk and on the trade-offs for a long-horizon saver.',
      ),
    ),
    block(
      'intro-2',
      p(
        'Neither form is the right answer for every portfolio. A short-term trader and a long-horizon saver may reach different answers. The point of the comparison is to make the structure visible, so the choice is a design decision rather than a default.',
      ),
    ),
    block('h2-etf', h2('How a gold ETF is built')),
    block(
      'etf-1',
      p(
        'A gold ETF is a pooled fund that holds gold for its shareholders. The fund is set up as a grantor trust. A sponsor manages the trust. A custodian, usually a major bank, stores the metal in vaults. Authorized participants create and redeem fund shares in large blocks by delivering or receiving allocated metal.',
      ),
    ),
    block(
      'etf-2',
      p(
        'An investor who buys an ETF share buys a piece of that pooled claim. The share trades on a regulated exchange. It tracks the gold price closely but not perfectly. The fund charges an annual expense ratio that compounds against the asset base. The shareholder does not have title to a specific bar or coin.',
      ),
    ),
    block(
      'etf-3',
      p(
        'The upside of this structure is operational simplicity. Any brokerage account can buy and sell a gold ETF in seconds. The spreads are narrow. The quote is live during market hours. For a saver who wants price exposure and nothing more, the ETF is a direct route.',
      ),
    ),
    block('h2-counterparty', h2('Counterparty risk in an ETF')),
    block(
      'counterparty-1',
      p(
        'Every gold ETF sits on a stack of third parties. The sponsor manages the fund. The custodian holds the metal. A sub-custodian may hold part of the allocation in a separate vault. The authorized participants handle creation and redemption. Each of these parties is a counterparty. Each one carries some small chance of error, disruption, or default.',
      ),
    ),
    block(
      'counterparty-2',
      p(
        'In normal times, these risks are small and well managed. Funds are audited. Custodians carry insurance. Regulators oversee the reporting. The system works as designed. In a severe market event, though, the paper claim and the physical metal can behave in different ways. The shareholder owns a claim on metal, not the metal itself.',
      ),
    ),
    block('h2-physical', h2('How physical bullion is held')),
    block(
      'physical-1',
      p(
        'Physical bullion is the metal itself. A buyer takes direct legal title to specific bars or coins. The holding can sit in a home safe, a safety deposit box, or an independent depository. Inside a precious metals IRA, the metal sits at an approved depository in the name of the IRA trust, not in the name of the individual account holder.',
      ),
    ),
    block(
      'physical-2',
      p(
        'There is no sponsor, no trust structure, and no annual expense ratio. The holding carries its own specific costs. Storage and insurance are real line items. A purchase and a future sale each carry a dealer spread. Those costs need to be budgeted in advance, not ignored.',
      ),
    ),
    block(
      'physical-3',
      p(
        'What physical bullion removes is the chain of third-party claims. The ounce in the vault is the actual asset. There is no fund sponsor that can dissolve the trust. There is no custodian balance sheet that affects the claim. For a long-horizon saver, the absence of that intermediary chain is the primary reason to pay the storage cost.',
      ),
    ),
    block(
      'callout-counterparty',
      callout(
        'info',
        'An ETF share is a claim on metal. Physical bullion is the metal. In calm markets the two move together. In stressed markets, the difference in structure can matter.',
      ),
    ),
    block('h2-compare', h2('Side-by-side trade-offs')),
    block('h3-access', h3('Access and trading')),
    block(
      'access-1',
      p(
        'Gold ETFs trade in a brokerage account. A buyer can enter and exit in seconds during market hours. The transaction cost is a narrow bid-ask spread plus any brokerage commission. Physical bullion is bought from a dealer, shipped or delivered to a vault, and sold back through a dealer. The full cycle takes longer and has a wider spread on each side.',
      ),
    ),
    block('h3-cost', h3('Cost structure')),
    block(
      'cost-1',
      p(
        'ETFs charge an annual expense ratio that compounds over a long holding period. Physical bullion has a front-end premium, an annual storage and insurance fee, and a back-end dealer spread on sale. Over a short horizon, the ETF is usually cheaper. Over a long horizon, the comparison narrows and depends on the specific fees involved.',
      ),
    ),
    block('h3-control', h3('Ownership and control')),
    block(
      'control-1',
      p(
        'An ETF share is owned through a brokerage and a custodian. The investor relies on that chain. Physical bullion is held in direct title. Inside an IRA, that title sits with the IRA trust. Outside an IRA, the buyer can hold the metal in person, at a bank, or at a depository. The trade-off is convenience for control.',
      ),
    ),
    block('h2-role', h2('The role each form plays')),
    block(
      'role-1',
      p(
        'A gold ETF is a strong tool for short-term price exposure inside a taxable brokerage account. It is easy to enter, easy to exit, and low-friction for a saver who wants a small allocation alongside stocks and bonds. For that specific job, it is hard to beat.',
      ),
    ),
    block(
      'role-2',
      p(
        'Physical bullion is a stronger tool for long-horizon wealth preservation. It removes the chain of third parties. It sits outside the banking and brokerage system. Inside a precious metals IRA, it also gives tax-deferred growth on the same metal-anchored asset. For a saver whose goal is to own a real asset for decades, that structure lines up with the goal.',
      ),
    ),
    block(
      'role-3',
      p(
        'Some savers hold both. An ETF slice in a brokerage account handles short-term adjustments. A physical slice in an IRA or a depository handles the long-horizon core. The mix is a design choice, not a rule. The important step is to know which form is doing which job.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'Do I own the gold when I buy a gold ETF?',
        'You own a share of a trust that holds gold. The metal sits with a custodian. You do not have title to any specific bar. In normal markets, that claim tracks the gold price closely.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'Can a gold ETF fit inside an IRA?',
        'Yes. A gold ETF can be held in a standard brokerage IRA. What a standard IRA cannot hold is physical bullion. A precious metals IRA is a separate structure set up for direct ownership of eligible physical metal.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'Do I own the gold when I buy a gold ETF?',
      answer:
        'You own a share of a trust that holds gold. The metal sits with a custodian bank. You do not have title to any specific bar or coin. In normal markets, the ETF share price tracks the gold price closely.',
    },
    {
      question: 'Can a gold ETF fit inside an IRA?',
      answer:
        'Yes. A gold ETF can be held in a standard brokerage IRA. What a standard IRA cannot hold is physical bullion. A precious metals IRA is a separate structure set up for direct ownership of eligible physical metal.',
    },
  ],
}
