import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.crypto.bitcoin-ira-guide',
  pillar: 'crypto',
  slug: 'bitcoin-ira-guide',
  title: 'The Ultimate Guide to Bitcoin IRAs',
  summary:
    'How to add Bitcoin and other cryptocurrencies to your retirement portfolio.',
  metaTitle: 'Bitcoin IRA Guide: How to Invest in Crypto for Retirement',
  metaDescription:
    'Learn the basics of setting up a Bitcoin IRA, including tax implications, storage options, and top crypto IRA companies.',
  schemaJsonLdType: 'Article',
  publishedAt: '2026-05-01',
  updatedAt: '2026-05-01',
  authorSlug: 'jane',
  crossLinks: ['ira-rules/rollover-mechanics'],
  citations: [citation('irs-590a')],
  body: [
    block(
      'intro',
      p(
        'Bitcoin is the most famous digital asset in the world today. Many investors want to add it to their retirement savings. A Bitcoin IRA makes this simple, letting you hold digital coins while getting great tax breaks.',
      ),
      p(
        'Crypto moves very fast and carries a good deal of risk. But it also offers a unique way to grow your money over time. This guide covers how a Crypto IRA works and what rules you need to follow.',
      ),
    ),
    block('h2-how-it-works', h2('How Crypto IRAs Work')),
    block(
      'how-it-works',
      p(
        'A Crypto IRA acts like a special self-directed retirement account. You cannot buy digital assets inside a normal workplace plan or a basic IRA. You must set up a dedicated account with an approved custodian.',
      ),
      p(
        'The custodian handles the complex rules for you. They watch your deposits, report to the IRS, and link you to a secure exchange where you can buy digital tokens.',
      ),
    ),
    block('h2-security', h2('Security and Storage')),
    block(
      'security',
      p(
        'Security is the main concern when dealing with any cryptocurrency. If you lose your private keys, your digital wealth is gone forever. Because of this danger, top Crypto IRAs use strong cold storage options.',
      ),
      p(
        'Cold storage means your private keys stay completely offline at all times. They are never connected to the internet, which heavily protects your retirement funds from hackers.',
      ),
      callout(
        'info',
        'Always ask your IRA provider how they secure digital assets. Look for platforms that use multi-signature wallets and offline storage protocols.',
      ),
    ),
    block('h2-taxes', h2('Tax Advantages')),
    block(
      'taxes',
      p(
        'Taxes on regular crypto trades can be very high. Every time you sell Bitcoin at a profit, you trigger a tax event. A Crypto IRA easily solves this problem.',
      ),
      p(
        'Inside a Traditional IRA, your crypto grows without current taxes. You only pay taxes when you take cash out during retirement. In a Roth IRA, your growth remains completely tax-free.',
      ),
    ),
  ],
  faqs: [
    faq(
      'Can I move my current Bitcoin into an IRA?',
      'No. The IRS does not allow you to transfer personal assets into an IRA. You must fund the account with cash or a 401(k) rollover, then buy the crypto inside the IRA.',
    ),
    faq(
      'What coins can I buy?',
      'Most platforms offer Bitcoin and Ethereum. Some also offer Litecoin, Cardano, and other major tokens. The list depends on your specific custodian.',
    ),
  ],
}
