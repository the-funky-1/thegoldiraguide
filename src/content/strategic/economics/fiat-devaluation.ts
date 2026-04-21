import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, h3, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.economics.fiat-devaluation',
  pillar: 'economics',
  slug: 'fiat-devaluation',
  title: 'Precious Metals and Fiat Currency Devaluation',
  summary:
    'How economists measure the loss of purchasing power in a fiat currency and why gold has a long record as a store of value through those cycles.',
  metaTitle: 'Precious Metals and Fiat Currency Devaluation',
  metaDescription:
    'Define purchasing power, review the CPI and PCE inflation measures, and place gold in the context of long-run currency devaluation.',
  schemaJsonLdType: 'Article',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: [
    'economics/portfolio-volatility',
    'economics/supply-demand-industrial',
  ],
  citations: [citation('finra-metals')],
  body: [
    block(
      'intro',
      p(
        'A fiat currency is money that holds value by government decree, not by a link to a metal or a basket of goods. The United States dollar has been a pure fiat currency since 1971. That status gives central banks tools to manage an economy. It also means the purchasing power of a unit of currency can fall over time. This piece defines those terms and places gold in that long-run story.',
      ),
    ),
    block(
      'intro-2',
      p(
        'The goal here is not a forecast. The goal is a clear set of definitions. A saver who understands how inflation is measured and why central banks hold gold can make a better choice about whether a small metals allocation fits a retirement plan.',
      ),
    ),
    block('h2-power', h2('Purchasing power in plain terms')),
    block(
      'power-1',
      p(
        'Purchasing power is the basket of goods and services that one unit of currency can buy. When prices rise faster than wages, each dollar buys a smaller basket. That shift is the real cost of inflation for a household. The nominal dollar is unchanged. The basket is smaller.',
      ),
    ),
    block(
      'power-2',
      p(
        'A saver who holds cash for decades feels this shift in a direct way. A dollar saved in 1970 does not buy what a dollar buys today. A long horizon makes small annual changes add up. That is why savers who look past a single cycle care about inflation, not just interest rates.',
      ),
    ),
    block('h2-metrics', h2('How inflation is measured: CPI and PCE')),
    block(
      'metrics-intro',
      p(
        'Two price indexes dominate the conversation in the United States. The Consumer Price Index and the Personal Consumption Expenditures price index. Both try to measure the change in the cost of a basket of goods over time. They use different baskets and different methods.',
      ),
    ),
    block('h3-cpi', h3('CPI: the Consumer Price Index')),
    block(
      'cpi-1',
      p(
        'The Consumer Price Index is built by the Bureau of Labor Statistics. It tracks the prices urban households pay for a fixed basket that includes food, housing, energy, medical care, and transportation. The basket is updated on a set schedule. The weights reflect what surveyed households spend.',
      ),
    ),
    block(
      'cpi-2',
      p(
        'CPI is the headline number most people see in the news. Wages in many contracts, Social Security cost-of-living updates, and some bond yields are linked to it. Core CPI strips out food and energy, which move in sharp short-run swings. That narrower measure gives a steadier read on the underlying trend.',
      ),
    ),
    block('h3-pce', h3('PCE: Personal Consumption Expenditures')),
    block(
      'pce-1',
      p(
        'The Personal Consumption Expenditures price index is built by the Bureau of Economic Analysis. It covers a broader set of spending, including items paid for on behalf of households such as employer health care. The basket weights update more often. That design tends to capture substitution when prices shift.',
      ),
    ),
    block(
      'pce-2',
      p(
        'PCE is the measure the Federal Reserve watches most closely when it sets policy. Core PCE, which again strips food and energy, is the specific number tied to the central bank inflation target. A saver who wants to track the policy lens should follow core PCE, not headline CPI alone.',
      ),
    ),
    block(
      'callout-metrics',
      callout(
        'info',
        'CPI and PCE both try to measure the same thing, but they use different baskets and different methods. A gap between the two is normal. Reading both, over a long window, gives a fuller picture than either one on its own.',
      ),
    ),
    block('h2-gold', h2('Gold as a tangible, non-yielding store of value')),
    block(
      'gold-1',
      p(
        'Gold is a physical asset. It does not pay interest. It does not pay a dividend. It does not promise future cash flows. What gold offers is scarcity, durability, and a long monetary history. Those traits are what savers buy when they add gold to a portfolio. They are not buying an income stream.',
      ),
    ),
    block(
      'gold-2',
      p(
        'Economists who study long time series point out that gold has held purchasing power across many regimes. An ounce of gold in the ancient world bought a well-tailored garment. An ounce of gold today buys a similar garment. The comparison is rough, but the pattern is what it shows. Over long windows, gold tends to track the price of real goods rather than the number on a currency note.',
      ),
    ),
    block(
      'gold-3',
      p(
        'This is a historical pattern, not a promise. Gold prices can fall for years at a time. The asset does not hedge every cycle. The claim is narrower: across multi-decade spans and across currency regimes, gold has kept a steady place as a store of value. That is the case for a small, disciplined allocation, not a case for concentration.',
      ),
    ),
    block('h2-central', h2('Central banks and gold reserves')),
    block(
      'central-1',
      p(
        'Central banks hold gold as a reserve asset. The holdings sit on the balance sheet next to foreign currency, government bonds, and special drawing rights. Gold has been part of that reserve stack for centuries. It is held by the oldest central banks and by many newer ones.',
      ),
    ),
    block(
      'central-2',
      p(
        'In recent years, central banks as a group have been net buyers of gold. The broad trend is well documented by the World Gold Council and by the International Monetary Fund reserve reports. The mix of which banks are buying has shifted over time, but the aggregate direction has been toward more gold on reserve balance sheets, not less.',
      ),
    ),
    block(
      'central-3',
      p(
        'That signal is worth noting. The institutions that create currency also hold a reserve asset with no counterparty and no maturity. A private saver who keeps a small share in gold is following a pattern those institutions have followed for generations.',
      ),
    ),
    block('h2-balance', h2('A balanced view for the household saver')),
    block(
      'balance-1',
      p(
        'None of this means gold always rises. It does not. Gold had long flat periods in the 1980s and 1990s. During those years, equities and bonds did much of the work in a balanced portfolio. A saver who held only gold missed a large run in other assets.',
      ),
    ),
    block(
      'balance-2',
      p(
        'The honest framing is simpler. Gold is one tool among several. Equities carry the growth. Bonds carry the income. A small gold or metals allocation, on the order of five to ten percent, has a specific job. It sits outside the paper markets and tends to move on its own schedule. It is not a forecast of the next decade. It is a design choice for a portfolio built to last across many decades.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'Is gold a hedge against inflation in every cycle?',
        'No. The historical record is mixed over short windows. Gold has held purchasing power well across long spans and across currency regime changes, but it has also had long flat periods. The case is long-horizon, not cycle-by-cycle.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'Which inflation measure should I watch, CPI or PCE?',
        'Both. CPI is the headline number tied to many household contracts and Social Security updates. Core PCE is the measure the Federal Reserve uses for its policy target. Reading both gives a fuller picture of the trend.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'Is gold a hedge against inflation in every cycle?',
      answer:
        'No. The record is mixed over short windows. Gold has held purchasing power well across long spans and across currency regime changes, but it has had long flat periods. The case is long-horizon, not cycle-by-cycle.',
    },
    {
      question: 'Which inflation measure should I watch, CPI or PCE?',
      answer:
        'Both. CPI is the headline number tied to many household contracts and Social Security updates. Core PCE is the measure the Federal Reserve uses for its policy target. Reading both gives a fuller picture.',
    },
  ],
}
