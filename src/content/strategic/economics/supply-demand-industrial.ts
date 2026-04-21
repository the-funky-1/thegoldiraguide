import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, h3, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.economics.supply-demand-industrial',
  pillar: 'economics',
  slug: 'supply-demand-industrial',
  title: 'Industrial Demand: Silver, Platinum, and Palladium',
  summary:
    'How industrial uses drive a much larger share of silver, platinum, and palladium demand than they do for gold, and why that difference shapes their volatility.',
  metaTitle: 'Industrial Demand: Silver, Platinum, Palladium',
  metaDescription:
    'How industrial demand from solar, catalytic converters, and electronics shapes silver, platinum, and palladium prices, and how that contrasts with gold.',
  schemaJsonLdType: 'Article',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: ['economics/fiat-devaluation', 'economics/portfolio-volatility'],
  citations: [citation('finra-metals')],
  body: [
    block(
      'intro',
      p(
        'Gold, silver, platinum, and palladium sit together on many brochures. The brochures often smooth over one key difference. Gold is held mostly as a monetary reserve. The other three have large industrial uses that drive their demand. That gap shapes how each metal behaves in a cycle.',
      ),
    ),
    block(
      'intro-2',
      p(
        'This article walks through the industrial side of silver, platinum, and palladium. It names the uses that drive each market. It then explains why those uses tend to make these three metals move more than gold across a business cycle.',
      ),
    ),
    block('h2-silver', h2('Silver: solar panels and electronics')),
    block(
      'silver-1',
      p(
        'Silver has the highest electric flow of any metal. That trait makes it useful in a long list of electronic parts. Wiring in high-end circuits, plating on connectors, and contacts inside small devices all use silver. The amount per unit is small. The total across the global electronics trade is large.',
      ),
    ),
    block(
      'silver-2',
      p(
        'The biggest growth driver for silver in recent years has been solar panels. A silver paste is used on the front of most solar cells. As global solar build-out has grown, the silver used per panel has fallen. Total demand from the sector has still kept rising. Silver also shows up in medical, imaging, and brazing work across factories.',
      ),
    ),
    block(
      'silver-3',
      p(
        'Silver still has strong investment demand as well. Coins, bars, and ETFs take a real share of the yearly draw. The dual nature of silver, as both money and a factory input, helps explain why its price can move further than gold on the same macro signal.',
      ),
    ),
    block('h2-platinum', h2('Platinum: catalytic converters and hydrogen')),
    block(
      'platinum-1',
      p(
        'Platinum is a precious metal with a dense set of factory uses. The largest demand segment is autos. Catalytic converters on diesel engines use platinum to turn harmful exhaust gases into less harmful ones. Gasoline vehicles also use some platinum in their emission systems, above all in regions with tight rules.',
      ),
    ),
    block(
      'platinum-2',
      p(
        'Beyond cars, platinum has a growing role in the hydrogen economy. Fuel cells use platinum as a catalyst. Electrolyzers that make hydrogen from water also use platinum group metals. The scale of these uses is still small next to catalytic converters. The potential is one reason platinum draws long-horizon investor interest.',
      ),
    ),
    block(
      'platinum-3',
      p(
        'Jewelry is the third major pillar of platinum demand, followed by chemical and petroleum refining. Supply is packed into a small set of countries, with South Africa making the largest share. Tight supply and cyclical demand make platinum prices more sensitive to business cycles than gold prices.',
      ),
    ),
    block('h2-palladium', h2('Palladium: gasoline catalysts and electronics')),
    block(
      'palladium-1',
      p(
        'Palladium sits in the platinum group and shares many of the same traits. Its largest single use is in catalytic converters on gasoline engines. When tight emission rules in major car markets pushed makers to use more palladium per vehicle, the demand growth that followed was one of the defining stories in the metals market.',
      ),
    ),
    block(
      'palladium-2',
      p(
        'Palladium is also used in electronics and in some dental alloys. It serves as a substitute for platinum in some industrial catalysts when price gaps favor it. That swap effect is one reason platinum and palladium prices often move in related but not identical paths.',
      ),
    ),
    block(
      'palladium-3',
      p(
        'Supply for palladium is even more packed than platinum. A small set of mines, in Russia and South Africa, make most of the yearly supply. Recycled auto catalysts add to the mix. A break in either source can move prices fast, in either direction.',
      ),
    ),
    block(
      'callout-demand',
      callout(
        'info',
        'Gold demand is led by monetary and jewelry uses. Silver, platinum, and palladium each have large industrial pieces. That gap is the main reason the three tend to have wider price swings than gold.',
      ),
    ),
    block('h2-contrast', h2('Why this contrasts with gold')),
    block(
      'contrast-1',
      p(
        'Gold has industrial uses, but they are small as a share of total yearly demand. Electronics and dentistry use some gold each year. The top demand groups are jewelry, investment, and central bank reserves. Those groups react to monetary conditions and to investor mood, not mainly to factory cycles.',
      ),
    ),
    block(
      'contrast-2',
      p(
        'Silver, platinum, and palladium have a very different demand mix. A large share of their demand comes from factories and auto plants. When activity slows, industrial demand for these metals can soften. When activity picks up, demand can tighten fast. The monetary side exists for silver and less so for the platinum group. It does not drive the price path.',
      ),
    ),
    block(
      'contrast-3',
      p(
        'This is why the three industrial metals often show larger price swings than gold during a cycle. In a slump, their prices tend to fall further. In a recovery, they can climb further. That higher swing is not good or bad on its own. It is a fact about the asset that has to be weighed in an allocation choice.',
      ),
    ),
    block('h2-implications', h2('Portfolio implications')),
    block(
      'implications-1',
      p(
        'For a careful saver, the lower swing in gold often makes it the first choice for a metals slice. Gold has the longest monetary record and the deepest market. It is the baseline against which the others are judged.',
      ),
    ),
    block(
      'implications-2',
      p(
        'A saver who wants extra industrial exposure may add a smaller share of silver, platinum, or palladium. Each is tied to a different set of industries. Silver is tied to solar and electronics. Platinum is tied to diesel engines and the new hydrogen sector. Palladium is tied to gasoline engines. The three can behave in very different ways during the same cycle.',
      ),
    ),
    block(
      'implications-3',
      p(
        'None of this is a forecast. The structure is what it is. Industrial metals carry industrial cycle risk. An allocation choice is stronger when the saver knows what each metal does in the economy, not just what the chart line looks like.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'Why is silver more volatile than gold?',
        'Silver has a large industrial demand piece tied to electronics and solar panels. That demand shifts with the business cycle. Silver also has a smaller market than gold, so the same size trade moves the price more.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'Do platinum and palladium belong in a metals IRA?',
        'Yes, if they meet the fineness rules set by the IRS. Both metals are eligible for a self-directed precious metals IRA when they come from approved sources and meet the specific purity standards.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'Why is silver more volatile than gold?',
      answer:
        'Silver has a large industrial demand piece tied to electronics and solar panels. That demand shifts with the business cycle. Silver also has a smaller market than gold, so the same size trade moves the price more.',
    },
    {
      question: 'Do platinum and palladium belong in a metals IRA?',
      answer:
        'Yes, if they meet the fineness rules set by the IRS. Both metals are eligible for a self-directed precious metals IRA when they come from approved sources and meet the specific purity standards.',
    },
  ],
}
