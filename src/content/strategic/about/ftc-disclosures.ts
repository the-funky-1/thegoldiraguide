import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.about.ftc-disclosures',
  pillar: 'about',
  slug: 'ftc-disclosures',
  title: 'FTC Disclosures and Material Connections',
  summary:
    'Plain-English disclosure of the corporate relationship between The Gold IRA Guide and Liberty Gold Silver, written to meet the 2023 FTC Endorsement Guides at 16 CFR Part 255.',
  metaTitle: 'FTC Disclosures and Material Connections',
  metaDescription:
    'The Gold IRA Guide is owned by Liberty Gold Silver. This page discloses that material connection in plain English per the 2023 FTC Endorsement Guides.',
  schemaJsonLdType: 'Article',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: ['about/about-the-guide', 'about/accountability-standard'],
  citations: [citation('ftc-endorsement-guides')],
  body: [
    block(
      'intro',
      p(
        'This page states the material connections between the people and entities behind The Gold IRA Guide. The Federal Trade Commission updated its Endorsement Guides in 2023. Those guides, at 16 CFR Part 255, require any material connection between a content publisher and a commercial interest to be clear and conspicuous to a reasonable reader. This page follows that rule.',
      ),
    ),
    block(
      'intro-2',
      p(
        'A material connection is any tie that could shape the weight a reader gives to a claim. Corporate ownership is one such tie. Employment is another. A referral fee or an affiliate payout counts too. When one of these ties exists, the FTC wants it stated up front. It should not be buried in a dense legal footer at the foot of the page.',
      ),
    ),
    block('h2-ownership', h2('The ownership relationship')),
    block(
      'ownership-1',
      p(
        'The Gold IRA Guide is a wholly owned educational subsidiary of Liberty Gold Silver. Liberty Gold Silver is a precious metals dealer that sells physical gold, silver, platinum, and palladium to retail clients. The dealer desk is a separate operating surface. It has its own staff, its own compliance function, and its own phone lines.',
      ),
    ),
    block(
      'ownership-2',
      p(
        'Liberty Gold Silver funds the editorial work on this hub. The parent company does not review individual articles before they are posted. It does not direct the editorial team to recommend its own products. It does not set a quota for mentions of its own name. That separation is a policy, and it is documented so a reader can hold the hub to it.',
      ),
    ),
    block(
      'ownership-3',
      p(
        'The hub does not link out to the dealer site on its editorial pages. A reader who wants to reach that dealer can find it through a normal web search. The hub does not push readers toward the parent company. That is a choice, not an accident of layout.',
      ),
    ),
    block(
      'callout-disclosure',
      callout(
        'info',
        'The Gold IRA Guide is owned by Liberty Gold Silver. This is the full material connection. There is no hidden sponsor, no third-party investor, and no affiliate program. The disclosure is stated plainly so any reader can see it before they read the articles.',
      ),
    ),
    block('h2-no-affiliate', h2('No affiliate or referral compensation')),
    block(
      'affiliate-1',
      p(
        'The hub does not earn affiliate commissions. It does not take referral fees from other dealers, custodians, or depositories. It does not run paid ranking tables or sponsored listings. It does not publish awards that carry a fee to participate. None of the common affiliate revenue models used in the precious metals space apply to this site.',
      ),
    ),
    block(
      'affiliate-2',
      p(
        'This matters. The affiliate market around precious metals often uses tricks that steer readers. A ranking table that looks like editorial content can be a paid placement. A blog review that looks like real analysis can be an ad that pays per click. The hub leaves those models alone. No article is shaped by a payout it could earn.',
      ),
    ),
    block(
      'affiliate-3',
      p(
        'When a third party is named in an article on this hub, it is because a reader needs the name to understand a rule, a custodian role, or a regulatory notice. The name is not placed because a referral fee was offered. Any outbound link goes to a primary source such as an IRS page, a CFTC advisory, or a FINRA bulletin. A reader can verify that pattern by clicking any citation on any article.',
      ),
    ),
    block('h2-placement', h2('Where the disclosure appears')),
    block(
      'placement-1',
      p(
        'The FTC Endorsement Guides require disclosures to be clear and conspicuous. A disclosure that is only visible after a long scroll does not meet that bar. This hub places the disclosure in three locations. It appears on this page, which is linked from the footer of every page. It appears on the About page, which explains the corporate structure. It appears in the author profiles, where each author states their employer.',
      ),
    ),
    block(
      'placement-2',
      p(
        'A reader arriving on any article can follow a single footer link to reach this page. The path is short. The text is in plain English. A reader who wants the legal citation can use the FTC Endorsement Guides link in the citation list at the bottom of this page. The reader who only wants the plain summary can stop at the callout box above.',
      ),
    ),
    block('h2-advertising', h2('Advertising practices we avoid')),
    block(
      'ad-1',
      p(
        'The hub commits to three things it will not do. It will not publish articles that mimic news coverage while serving as advertising. It will not accept paid reviews dressed as editorial opinions. It will not run lead-generation forms that pass reader contact details to the parent company or any third party without a clear, separate opt-in on the form itself.',
      ),
    ),
    block(
      'ad-2',
      p(
        'These practices are common enough in the broader affiliate marketing sector that naming them matters. A reader who has seen each of these patterns on other precious metals sites can check this site against that list. If any of these patterns appears on the hub, the reader is invited to flag it through the contact form so the editorial team can remove it.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'Does The Gold IRA Guide get paid for sending me to Liberty Gold Silver?',
        'No. The hub does not run outbound referral links to the parent company on its editorial pages. It does not receive a per-lead or per-transaction fee when a reader engages Liberty Gold Silver. The funding relationship is direct corporate ownership, which is disclosed on this page and on the About page.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'Do you have affiliate links to other dealers or custodians?',
        'No. The hub does not carry affiliate links. Outbound links in articles go to primary government sources such as the IRS, the CFTC, the SEC, or FINRA. A reader can verify the pattern by inspecting the citation list at the bottom of any article on the site.',
      ),
    ),
  ],
  faqs: [
    {
      question:
        'Does The Gold IRA Guide get paid for sending me to Liberty Gold Silver?',
      answer:
        'No. The hub does not run outbound referral links to the parent company on its editorial pages. It does not receive a per-lead or per-transaction fee. The funding relationship is direct corporate ownership.',
    },
    {
      question: 'Do you have affiliate links to other dealers or custodians?',
      answer:
        'No. The hub does not carry affiliate links. Outbound links in articles go to primary government sources such as the IRS, the CFTC, the SEC, or FINRA. The pattern is verifiable in any article.',
    },
  ],
}
