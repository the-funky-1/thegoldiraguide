import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, h3, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.tools.correlation-matrix',
  pillar: 'tools',
  slug: 'correlation-matrix',
  title: 'Asset Class Correlation Matrix: Equities, Bonds, Metals',
  summary:
    'A plain-language explainer on how correlation works between asset classes, what the numbers mean, and what the historical record shows about gold and the equity market during periods of stress.',
  metaTitle: 'Asset Class Correlation: Stocks, Bonds, Metals',
  metaDescription:
    'What correlation is, how it works between stocks, bonds, and metals, and what history shows about gold and the stock market during periods of stress.',
  schemaJsonLdType: 'Article',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: [
    'economics/portfolio-volatility',
    'economics/physical-vs-etfs',
  ],
  citations: [citation('finra-metals')],
  body: [
    block(
      'intro',
      p(
        'A correlation matrix is a grid that shows how closely two asset classes move together over a given period. The grid in the tool presents the historical correlation between stocks, bonds, and precious metals. This page explains what the numbers in the grid mean, what the historical record shows about gold and the stock market during periods of stress, and what the matrix does not tell a saver.',
      ),
    ),
    block('h2-what-is', h2('What a correlation number means')),
    block(
      'what-1',
      p(
        'The correlation between two asset classes is a number that falls between negative one and positive one. A number close to positive one means the two assets move up and down together most of the time. A number close to negative one means the two assets tend to move in opposite directions. A number close to zero means the two assets do not move together in any steady way.',
      ),
    ),
    block(
      'what-2',
      p(
        'The number is a measure of the shape of the relationship, not the size of the moves. A correlation of positive nine tenths tells a saver that the two assets usually move in the same direction. It does not say the moves are the same size. Stocks and bonds can both rise on the same day, but stocks can rise much more than bonds and still show a positive correlation on the grid.',
      ),
    ),
    block(
      'callout-range',
      callout(
        'info',
        'The correlation number falls between negative one and positive one. A reading near positive one means steady co-movement in the same direction. A reading near negative one means steady movement in opposite directions. A reading near zero means no steady pattern at all.',
      ),
    ),
    block('h2-why', h2('Why correlation matters for a saver')),
    block(
      'why-1',
      p(
        'A saver who holds only one asset class takes on the full risk of that class. If the class falls, the whole account falls with it. A saver who holds two asset classes with a low or negative correlation takes on a smaller total risk for the same expected return. The two classes do not fall together as often, so the portfolio swings are smaller.',
      ),
    ),
    block(
      'why-2',
      p(
        'This is the basic math behind the phrase diversification. A mix of assets with lower correlation gives a smoother ride across a long holding period. The portfolio can still fall in a given year. The swings from peak to trough are usually smaller than they would be in a single class account. The correlation grid helps a saver see which classes move with each other and which classes move on their own.',
      ),
    ),
    block('h2-gold', h2('Gold and the stock market during stress')),
    block('h3-pattern', h3('The historical pattern in broad terms')),
    block(
      'gold-1',
      p(
        'History shows a rough pattern between gold and the broad stock market. In calm periods, gold and the S&P 500 can show a mild positive correlation, a mild negative correlation, or a reading near zero. The exact number varies by the time window chosen. The broad long-run correlation between gold and the S&P 500 has been close to zero for much of recent history.',
      ),
    ),
    block('h3-stress', h3('Behavior during severe equity drawdowns')),
    block(
      'gold-2',
      p(
        'During periods of severe stock market stress, gold has often shown a low or even negative correlation to the S&P 500. When a sharp stock market drop takes hold, gold has on many occasions held its value or moved higher while stocks fall. This is the pattern that leads some savers to hold a small allocation of physical metal inside a diversified portfolio.',
      ),
    ),
    block(
      'gold-3',
      p(
        'The pattern is historical, not guaranteed. Past relationships between asset classes can shift. A saver who reads the grid should treat the numbers as a starting point for thought, not a forecast. The tool shows what has happened, not what will happen.',
      ),
    ),
    block('h2-bonds', h2('Bonds, stocks, and the classic mix')),
    block(
      'bonds-1',
      p(
        'Long-term government bonds have often shown a low or slightly negative correlation to stocks in normal market conditions. This is the math behind the classic stock and bond mix, where bonds are held to soften the swings of a stock-only portfolio. The correlation between bonds and stocks is not fixed, and there have been long stretches when both asset classes fell together.',
      ),
    ),
    block(
      'bonds-2',
      p(
        'Gold offers a different kind of diversification from bonds. Bonds pay income. Gold does not. Bonds are sensitive to interest rates. Gold has its own drivers, including inflation expectations, real yields, and global demand from central banks. The matrix helps a saver see these differences in numerical form rather than in words alone.',
      ),
    ),
    block('h2-limits', h2('What the matrix does not tell a saver')),
    block(
      'limits-1',
      p(
        'A correlation grid is a summary of the past. It cannot promise the same pattern in the future. A number that held steady for thirty years can shift in a new market regime. Savers should read the grid as a historical record, not a crystal ball.',
      ),
    ),
    block(
      'limits-2',
      p(
        'The grid also does not say anything about expected return. Two assets with a low correlation are not automatically a good pair. A saver also needs a view on the expected return of each class. A pair with low correlation and low expected return will produce a smooth but modest result. The matrix is one input into a larger decision, not the whole decision.',
      ),
    ),
    block(
      'limits-3',
      p(
        'Finally, the grid uses broad asset class labels. Real portfolios hold specific products, which can behave differently from the class label. A specific stock fund, a specific bond fund, and a specific gold product can all have their own quirks. The broad class numbers are a useful first cut, not a full picture of a real portfolio.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'What does a correlation of zero mean?',
        'A correlation of zero means the two asset classes have no steady pattern of moving together. In one period they might rise together. In the next period they might move in opposite directions. Over a long window, the ups and downs average out to a reading near zero on the grid.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'Is gold always negatively correlated with the stock market?',
        'No. The long-run correlation between gold and the broad stock market has been close to zero for much of recent history. Gold has often shown a low or negative correlation during periods of severe stock market stress, but the pattern is not a fixed rule. A saver should not assume the relationship will hold in every future shock.',
      ),
    ),
    block(
      'faq-3',
      faq(
        'Why is correlation not the whole story of diversification?',
        'Correlation describes the shape of the relationship between two assets, not the size of the moves or the expected return of each asset. A diversified portfolio also needs a view on expected return, volatility, and the size of each position. The correlation matrix is one input to the broader decision, not the full answer.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'What does a correlation of zero mean?',
      answer:
        'A correlation of zero means the two asset classes have no steady pattern of moving together. In one period they might rise together. In the next period they might move in opposite directions. Over a long window, the ups and downs average out to a reading near zero on the grid.',
    },
    {
      question: 'Is gold always negatively correlated with the stock market?',
      answer:
        'No. The long-run correlation between gold and the broad stock market has been close to zero for much of recent history. Gold has often shown a low or negative correlation during periods of severe stock market stress, but the pattern is not a fixed rule.',
    },
    {
      question: 'Why is correlation not the whole story of diversification?',
      answer:
        'Correlation describes the shape of the relationship between two assets, not the size of the moves or the expected return of each asset. A diversified portfolio also needs a view on expected return, volatility, and the size of each position.',
    },
  ],
}
