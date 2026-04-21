import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, h3, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.economics.portfolio-volatility',
  pillar: 'economics',
  slug: 'portfolio-volatility',
  title: 'Precious Metals in Portfolio Theory: Managing Volatility',
  summary:
    'How modern portfolio theory frames risk through standard deviation, correlation, and drawdown, and where a small precious metals slice fits as a volatility dampener.',
  metaTitle: 'Precious Metals and Portfolio Volatility',
  metaDescription:
    'A plain look at standard deviation, correlation, and drawdown, and how a five to ten percent metals slice acts as a volatility dampener in a balanced portfolio.',
  schemaJsonLdType: 'Article',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: ['economics/physical-vs-etfs'],
  citations: [citation('finra-metals')],
  body: [
    block(
      'intro',
      p(
        'A retirement portfolio is a system. The return is one output. The volatility is another. Modern portfolio theory, the framework taught in most finance classes, gives a set of tools for measuring both. This article walks through three of those tools in plain terms. It then places a small precious metals slice inside that framework.',
      ),
    ),
    block(
      'intro-2',
      p(
        'The goal is not to promise a specific return from gold. Gold pays no interest. It pays no dividend. It does not belong in the income side of the ledger. The case for a small slice rests on something else, which is the effect it has on the swing of the full portfolio.',
      ),
    ),
    block('h2-mpt', h2('The basics of modern portfolio theory')),
    block(
      'mpt-1',
      p(
        'Modern portfolio theory was developed by economist Harry Markowitz in the 1950s. The fundamental insight is that portfolio risk is not simply the sum of the individual asset risks. A collection of assets that do not move in lockstep can, as a group, exhibit a smaller swing than any single component. The combined return distribution is what matters for retirement planning.',
      ),
    ),
    block(
      'mpt-2',
      p(
        'Three measures do most of the work in this framework. Standard deviation, correlation, and maximum drawdown. Each one captures a different face of risk. Together, they give a clearer read on a portfolio than return alone.',
      ),
    ),
    block('h3-stdev', h3('Standard deviation: the width of the swing')),
    block(
      'stdev-1',
      p(
        'Standard deviation measures the typical gap between a single year return and the long-run average. A portfolio with a steady nine percent each year has a low standard deviation. A portfolio that returns nine percent on average but swings from minus twenty to plus forty has a high standard deviation. The average return is the same. The ride is very different.',
      ),
    ),
    block('h3-corr', h3('Correlation: how assets move together')),
    block(
      'corr-1',
      p(
        'Correlation measures how two assets tend to move in relation to each other. A correlation of plus one means they move in perfect lockstep. A correlation of zero means they move with no relation. A correlation of minus one means they move in exact opposite directions. Most real pairs of assets sit somewhere between zero and plus one.',
      ),
    ),
    block('h3-drawdown', h3('Maximum drawdown: the worst peak to trough')),
    block(
      'drawdown-1',
      p(
        'Maximum drawdown is the largest drop from a prior peak, measured through the full holding period. A portfolio can have an average return that looks fine, but if it lost forty percent in one stretch, an investor who needed cash at that moment felt that forty percent drop. Drawdown is what a retiree actually lives through.',
      ),
    ),
    block(
      'callout-tools',
      callout(
        'info',
        'A portfolio has three risk faces. Standard deviation is the width of the typical swing. Correlation is how parts move together. Drawdown is the worst drop from a peak. A good design watches all three, not just the average return.',
      ),
    ),
    block('h2-role', h2('Where a small metals slice fits')),
    block(
      'role-1',
      p(
        'A balanced retirement portfolio is often built around equities and bonds. A common starting design is sixty percent stocks and forty percent bonds. Stocks carry the long-run growth. Bonds carry the income and soften the swing. The two do not always move together, which is why the mix works.',
      ),
    ),
    block(
      'role-2',
      p(
        'Gold, and to a lesser extent silver and the platinum group, tends to show low correlation with stocks over long windows. That correlation is not fixed. It varies by period. What the long record shows is that during some stretches of market stress, gold has moved in the opposite direction from stocks, which gives the overall portfolio a smaller drawdown.',
      ),
    ),
    block(
      'role-3',
      p(
        'This is the core case for a small metals slice. Not a forecast of a future return. A structural effect on the swing of the portfolio. A five to ten percent slice, carved out of the bond side or from a cash position, can trim the standard deviation and the maximum drawdown of the full portfolio, while leaving most of the long-run return intact.',
      ),
    ),
    block('h2-income', h2('Why gold is not an income asset')),
    block(
      'income-1',
      p(
        'Gold pays no interest. Gold pays no dividend. It does not generate free cash flow for its holder. An investor who buys gold is not buying a stream of future payments. For an income-focused plan, gold is not the right tool.',
      ),
    ),
    block(
      'income-2',
      p(
        'A retirement plan that leans on income needs bonds, dividend-paying stocks, annuities, or rental property. Gold does a different job. Its job in the framework is to dampen the swing, not to pay the bills. This distinction matters. A saver who expects gold to act as an income source is using the wrong tool for the job.',
      ),
    ),
    block(
      'income-3',
      p(
        'Over a long span, gold has kept pace with a broad basket of real goods. That is a store of value role, not an income role. The two are separate, and a retirement plan needs both. A small metals slice fills one of those needs. Bonds and dividend equities fill the other.',
      ),
    ),
    block('h2-stress', h2('The low-correlation role under market stress')),
    block(
      'stress-1',
      p(
        'During calm markets, the correlation between gold and stocks is often mildly positive. Both can drift up together when liquidity is ample. The low-correlation story does not show up every day. Where it has shown up is during periods of severe stress, when investor demand for a real asset rises.',
      ),
    ),
    block(
      'stress-2',
      p(
        'The 1970s, the early 2000s, and the financial crisis of 2008 are three windows that historians often point to. In each case, stocks went through a difficult stretch, and gold behaved in a way that partly offset the drop. None of these windows is a promise about the next one. They are evidence that the low-correlation story is not a myth. It is a pattern the record supports.',
      ),
    ),
    block(
      'stress-3',
      p(
        'A disciplined saver treats this as design, not as a trade. The slice is set at the start of the plan. It is rebalanced on a schedule. The point is not to time the next stress event. The point is to have the slice in place when the event arrives, so the full portfolio swings less than it would without it.',
      ),
    ),
    block('h2-practice', h2('A simple allocation framework')),
    block(
      'practice-1',
      p(
        'A common framework for a working saver starts with a core of stocks and bonds. On top of that, a five to ten percent slice in precious metals can fill the dampener role. The exact figure depends on the saver age, risk tolerance, and tax situation. For a near-retiree, a higher end of that range can make sense. For a younger saver with a long runway, a lower figure may fit better.',
      ),
    ),
    block(
      'practice-2',
      p(
        'The slice can be held in one form or in a mix of forms. An ETF inside a brokerage account offers easy access. Physical metal inside a precious metals IRA offers direct title and tax-deferred growth. The choice is a design question. The dampener role is the same in either form.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'Does a metals slice lower my total return?',
        'Over a very long window, a small metals slice may lower the average return a small amount, because it is carved from an asset class with higher long-run returns. The trade-off is a narrower drawdown during stress events. A saver who values a smoother ride often accepts that trade.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'What size allocation is standard?',
        'A common starting point is five to ten percent of total retirement assets. The exact figure depends on the saver horizon and risk tolerance. A plan with a longer runway and a higher risk tolerance may use the lower end of that range.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'Does a metals slice lower my total return?',
      answer:
        'Over a very long window, a small metals slice may lower the average return a small amount, because it is carved from an asset class with higher long-run returns. The trade-off is a narrower drawdown during stress events. A saver who values a smoother ride often accepts that trade.',
    },
    {
      question: 'What size allocation is standard?',
      answer:
        'A common starting point is five to ten percent of total retirement assets. The exact figure depends on the saver horizon and risk tolerance. A plan with a longer runway and a higher risk tolerance may use the lower end of that range.',
    },
  ],
}
