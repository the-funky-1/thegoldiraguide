import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.about.about-the-guide',
  pillar: 'about',
  slug: 'about-the-guide',
  title: 'About The Gold IRA Guide',
  summary:
    'The Gold IRA Guide is an educational hub owned by Liberty Gold Silver. Its mandate is consumer education, systemic transparency, and higher accountability standards.',
  metaTitle: 'About The Gold IRA Guide',
  metaDescription:
    'The Gold IRA Guide is an educational hub owned by Liberty Gold Silver. No transactions happen here. Its mandate is consumer education and accountability.',
  schemaJsonLdType: 'Article',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: [
    'about/editorial-guidelines',
    'about/ftc-disclosures',
    'about/accountability-standard',
  ],
  citations: [citation('ftc-endorsement-guides')],
  body: [
    block(
      'intro',
      p(
        'The Gold IRA Guide is an educational website. It is a wholly owned subsidiary of Liberty Gold Silver. Liberty Gold Silver is a precious metals dealer that serves retail clients. The educational hub at thegoldiraguide.com is a separate surface from that dealer desk. It is a reference library. It is not a store.',
      ),
    ),
    block(
      'intro-2',
      p(
        'A visitor cannot buy metal on this site. There is no cart. There is no checkout. There is no price feed that moves in real time. The pages are static explainers. Each one answers a question a retirement account holder might ask before they speak with any dealer. The goal is to raise the floor of what a reader knows before a sales call starts.',
      ),
    ),
    block('h2-mandate', h2('The mandate of the hub')),
    block(
      'mandate-1',
      p(
        'The hub has a single mandate. It exists to publish consumer education about precious metals inside retirement accounts. The scope covers tax rules, storage rules, fee structures, market history, and the practical mechanics of a rollover. Every article is written so a reader can use it without speaking to a sales team first.',
      ),
    ),
    block(
      'mandate-2',
      p(
        'A second purpose is systemic transparency. The precious metals IRA market has long used complex pricing and dense paperwork. This hub aims to make those structures visible. A reader should leave the site able to ask sharper questions of any dealer, including Liberty Gold Silver itself. Sharper questions raise the standard of the whole market.',
      ),
    ),
    block(
      'mandate-3',
      p(
        'A third purpose is to raise the accountability standard across the industry. The hub publishes checklists, written estimate templates, and fee disclosure expectations that any dealer can meet. When a reader arrives at any sales desk with those expectations in hand, the desk must respond in kind. That pressure benefits buyers across the market, not only clients of one firm.',
      ),
    ),
    block(
      'callout-separation',
      callout(
        'info',
        'The educational hub and the Liberty Gold Silver dealer desk are separate. No transactions occur on this site. A reader can leave the hub, study the material, and then engage any dealer they choose. The hub does not push visitors toward the parent company.',
      ),
    ),
    block('h2-structure', h2('How the content is structured')),
    block(
      'structure-1',
      p(
        'The hub is organized into five pillars. The first pillar is IRA rules. It covers what the Internal Revenue Service allows inside a self-directed retirement account, including eligible metals and storage requirements. The second pillar is accountability. It covers how fees are set, how spreads work, and how a written estimate closes the gap between a verbal quote and a signed invoice.',
      ),
    ),
    block(
      'structure-2',
      p(
        'The third pillar is economics. It frames precious metals inside the wider context of inflation, portfolio volatility, and the long-run behavior of fiat currencies. The fourth pillar is tools. It is a set of calculators that let a reader test fee structures and spreads against their own account size. The fifth pillar is this one. It covers the identity, the editorial process, and the disclosure posture of the site itself.',
      ),
    ),
    block(
      'structure-3',
      p(
        'Each article sits inside one pillar and links to related pages in the others. The reading paths are short. A reader interested in fees can move from a calculator, to a fee structure article, to a written estimate checklist in three clicks. The design assumes that a reader has a narrow question and limited time. The pages are written to answer that question without padding.',
      ),
    ),
    block('h2-ownership', h2('Ownership and governance')),
    block(
      'ownership-1',
      p(
        'Liberty Gold Silver is the sole owner and operator of the hub. The parent company funds the editorial work. The parent company does not review individual articles before publication. The editorial team sets its own publication schedule and its own fact-checking protocol. The parent company sees articles when readers see them.',
      ),
    ),
    block(
      'ownership-2',
      p(
        'This arrangement is disclosed on the FTC disclosures page. The disclosure follows the 2023 FTC Endorsement Guides, which require material connections to be clear to a reasonable reader. A visitor who wants to know the full corporate relationship can find it linked from the footer of every page on the site.',
      ),
    ),
    block(
      'ownership-3',
      p(
        'The hub does not carry third-party advertising. It does not host affiliate links to other dealers. It does not publish paid ranking tables of precious metals firms. The absence of those revenue lines is deliberate. The hub is funded by the parent company so that the editorial content is not steered by traffic-driven incentives.',
      ),
    ),
    block(
      'ownership-4',
      p(
        'A reader who values that independence can verify it. The privacy policy lists every tracker on the site. The footer lists every outbound link. The author pages list credentials, tenure, and public profiles. The standing invitation is to check the posted record against the conduct of the site. The hub intends for those two to match, page after page, across years.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'Can I buy gold or open an IRA on this site?',
        'No. The hub is educational only. There is no checkout and no account opening form. A reader who wants to open a precious metals IRA must work with a dealer, a custodian, and a depository. The hub explains how those three parties interact, so a reader knows what to expect before any call.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'Does Liberty Gold Silver edit the articles on this hub?',
        'No. The parent company funds the editorial work and owns the domain. The editorial team sets its own fact-checking protocol and its own publication schedule. The corporate owner reviews articles after publication at the same cadence as any reader.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'Can I buy gold or open an IRA on this site?',
      answer:
        'No. The hub is educational only. There is no checkout and no account opening form. A reader who wants to open a precious metals IRA must work with a dealer, a custodian, and a depository.',
    },
    {
      question: 'Does Liberty Gold Silver edit the articles on this hub?',
      answer:
        'No. The parent company funds the editorial work and owns the domain. The editorial team sets its own fact-checking protocol. The corporate owner reviews articles after publication at the same cadence as any reader.',
    },
  ],
}
