import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.metals.silver-ira-guide',
  pillar: 'metals',
  slug: 'silver-ira-guide',
  title: 'Silver IRA Guide',
  summary:
    'A complete guide to adding silver to your retirement account, including allowed coins and IRS purity standards.',
  metaTitle: 'Silver IRA Guide: How to Invest in Silver for Retirement',
  metaDescription:
    'Learn how to set up a Silver IRA, the IRS rules for eligible silver coins and bars, and how to diversify your retirement portfolio.',
  schemaJsonLdType: 'Article',
  publishedAt: '2026-05-01',
  updatedAt: '2026-05-01',
  authorSlug: 'jane',
  crossLinks: ['ira-rules/eligible-metals'],
  citations: [citation('irs-590a')],
  body: [
    block(
      'intro',
      p(
        'Gold often gets the most attention from investors. However, silver offers an equally strong way to protect your wealth. Adding silver to your retirement plan gives you safety and high growth potential.',
      ),
      p(
        'Silver works as both a metal for money and a highly used factory asset. It is needed for solar panels, phones, and medical tools. The IRS officially lets you hold physical silver inside a tax-free retirement account.',
      ),
    ),
    block('h2-eligible-silver', h2('IRS Rules for Silver')),
    block(
      'eligible-silver',
      p(
        'The IRS has very strict rules regarding silver. Any silver product you buy must meet a high purity standard of .999 fineness. Thankfully, most common bullion bars easily meet this rule.',
      ),
      p(
        'You can safely buy popular assets like American Silver Eagles and Canadian Silver Maple Leafs. On the other hand, you are banned from buying old junk silver or rare coins, which will cause large tax fines.',
      ),
      callout(
        'danger',
        'We highly advise against buying graded coins. Dealers attach huge markups to these products. The IRS totally bans these assets from retirement accounts.',
      ),
    ),
    block('h2-storage', h2('Storage Rules')),
    block(
      'storage',
      p(
        'A Silver IRA works just like a standard Gold IRA. You are legally required to use a certified account custodian. You also must store your physical metals inside an approved vault.',
      ),
      p(
        'You cannot keep IRA silver inside your personal home. Storing these assets in a home safe breaks federal rules. Doing this will result in heavy fines and the sudden loss of your tax benefits.',
      ),
    ),
    block('h2-why-silver', h2('Why Choose Silver?')),
    block(
      'why-silver',
      p(
        'Silver costs much less to buy upfront compared to gold. This lower cost allows regular investors to easily gather large amounts of metal. Also, silver prices often move much faster than gold during big market runs.',
      ),
      p(
        'However, you must know that silver carries much higher price swings. Prices can drop fast during times of economic calm. A smart plan is to hold a good mix of both metals, combining steady gold with fast-growing silver.',
      ),
    ),
  ],
  faqs: [
    faq(
      'Can I hold both gold and silver in one IRA?',
      'Yes. You can hold gold, silver, platinum, and palladium in a single precious metals IRA. You do not need a separate account for each metal.',
    ),
    faq(
      'How much silver should I buy?',
      'Many experts suggest a mix. A common choice is keeping 70% in gold and 30% in silver. This balances the steady value of gold with the high upside of silver.',
    ),
  ],
}
