import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.about.accountability-standard',
  pillar: 'about',
  slug: 'accountability-standard',
  title: 'The Accountability Standard',
  summary:
    'Transparency posts information. Accountability pre-commits to it in writing. This page defines the standard The Gold IRA Guide holds itself and the industry to.',
  metaTitle: 'The Accountability Standard',
  metaDescription:
    'Transparency posts information. Accountability pre-commits to it in writing, before the money moves. Here is the standard we hold ourselves and the industry to.',
  schemaJsonLdType: 'Article',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: [
    'ira-rules/home-storage-fallacy',
    'accountability/written-estimate',
    'economics/portfolio-volatility',
    'tools/spread-markup-calculator',
  ],
  citations: [citation('finra-metals'), citation('ftc-endorsement-guides')],
  body: [
    block(
      'intro',
      p(
        'Every precious metals firm advertises itself as transparent. The word has been used so frequently in the industry that it has effectively stopped meaning anything specific. A fee schedule posted on a public website is routinely labeled transparent. A glossy brochure with a numbered list of products is labeled transparent. A recorded sales call that recites a long disclaimer is labeled transparent. In practice, nearly everything that carries the label is fundamentally passive. It is information placed where a reader can locate it, provided that the reader already knows to look.',
      ),
    ),
    block(
      'intro-2',
      p(
        'The Gold IRA Guide works from a different standard. The standard is accountability. Accountability is active. It is a written commitment made before the money moves. The firm states, on paper, what it will charge, how it will charge, and what it will deliver. The client keeps the document. If the final invoice drifts from the stated terms, the document is the record of the drift. That is a standard a client can hold a firm to. The softer version is not.',
      ),
    ),
    block('h2-definition', h2('Transparency is passive, accountability is active')),
    block(
      'def-1',
      p(
        'Transparency, in plain use, means that information exists and can be reached. A posted fee schedule is a transparent artifact. A public price feed is a transparent artifact. These are useful. They are not binding. A fee schedule posted today can be revised tomorrow. A general quote given on a call can drift by the time the invoice arrives. Transparency lets a reader see what a firm says it does. It does not tie the firm to any single client deal.',
      ),
    ),
    block(
      'def-2',
      p(
        'Accountability closes that gap. It is a written pre-commitment. The firm states the exact coin, the exact premium, the exact custodian fees, and the exact storage structure for one client, on one document, on one date. The client signs. The firm signs. The terms are fixed for that transaction. If the invoice shifts, the client has a document that precedes the shift. The firm must explain the change or reissue the terms.',
      ),
    ),
    block(
      'def-3',
      p(
        'The distinction appears minor on paper and becomes significant in practice. A transparent firm describes what it does in the general case, across all clients. An accountable firm specifies what it will do in the individual client case, in writing, and signs the statement. A client who wants to audit a transparent firm must compare a generic posted schedule against the final invoice. A client who wants to audit an accountable firm compares a specific signed estimate against the same invoice. The second comparison is considerably faster and substantially cleaner.',
      ),
    ),
    block(
      'callout-definition',
      callout(
        'info',
        'Transparency says what the firm does in the general case. Accountability says what the firm will do in this case, in writing, before the client pays. Both matter. Only the second can be enforced against a single invoice.',
      ),
    ),
    block('h2-tenets', h2('Three tenets we hold the industry to')),
    block(
      'tenet-1',
      p(
        'The first tenet is the rejection of hidden spreads. A spread is the gap between the wholesale spot price and the retail price a client pays. Every dealer carries a spread. It is how the desk earns its margin. The spread is not the problem. The hidden spread is the problem. The standard we hold is that the spread must be stated on a written estimate as a dollar amount per ounce and as a percent, with the spot price and the time stamp noted on the same page.',
      ),
    ),
    block(
      'tenet-2',
      p(
        'The second tenet is the exposure of scaling storage traps. A storage fee that scales with the account balance can start small and grow quietly. At one percent per year on a half-million-dollar account, the annual charge is five thousand dollars. At a flat fee, the same account might pay two hundred. The standard we hold is that every estimate must name the structure in plain words, flat or scaling, and show a dollar example at the funding amount. A client who reads it should not need a calculator to see which structure they have.',
      ),
    ),
    block(
      'tenet-3',
      p(
        'The third tenet is the written estimate itself. The estimate is the artifact that carries the first two tenets. It is issued before any wire moves. It names the coin or bar, the premium, the itemized custodian fees, and the storage structure. It is signed by the firm. The client keeps a copy. Any firm that can meet this standard can meet the other two. A firm that cannot meet this standard has not met the accountability bar, regardless of what its marketing material states.',
      ),
    ),
    block('h2-fiduciary', h2('The fiduciary aesthetic')),
    block(
      'fid-1',
      p(
        'A dealer in precious metals is not a fiduciary under federal law. The Employee Retirement Income Security Act of 1974 defines fiduciary status for retirement plan professionals. That status does not apply to a precious metals dealer in the ordinary course of selling coins and bars. A dealer is a counterparty. A dealer has its own economic interest in the deal. A client should know that going in.',
      ),
    ),
    block(
      'fid-2',
      p(
        'The accountability standard does not claim fiduciary status. It does something different. It borrows the habits of a fiduciary relationship and applies them to a counterparty relationship. The written estimate is the central habit. The itemized disclosure is another. The separate listing of dealer, custodian, and depository charges is a third. A client cannot trade a dealer for a fiduciary by asking. A client can insist on conduct that looks like a fiduciary standard of care. That is the aesthetic. It is a conduct standard, not a legal status.',
      ),
    ),
    block(
      'fid-3',
      p(
        'Clients who request this conduct will encounter two broad categories of firms. Firms that already operate this way will produce the document without friction or delay. Firms that do not operate this way will resist, change the subject, or promise to send something later that never actually arrives. The resistance itself is useful diagnostic information. It effectively sorts the industry into two populations. A client can then decide whether to proceed with a firm that resists the written record. Most clients who walk away from that initial firm find a measurably better document waiting at the next desk.',
      ),
    ),
    block('h2-apply', h2('How a reader can apply this standard')),
    block(
      'apply-1',
      p(
        'A reader does not need to memorize this page. The standard reduces to a short sequence. Ask for a written estimate before any wire is sent. Confirm that the estimate names the exact coin or bar, the spread as a dollar amount and a percent, and the spot reference with a time stamp. Confirm that custodian fees are listed by line with vendor names. Confirm that the storage fee is named as flat or scaling, with a dollar example.',
      ),
    ),
    block(
      'apply-2',
      p(
        'If each of those items is present on paper, the transaction meets the accountability bar. If any item is missing, the transaction is not ready. The reader does not need to be rude. The reader does not need to negotiate. The reader only needs to hold the line on the document. A firm that can produce the document will. A firm that cannot will either revise its process or lose the client. Both outcomes move the market toward the standard.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'Is accountability the same as being a fiduciary?',
        'No. A dealer is not a fiduciary under ERISA. Accountability is a conduct standard that mimics the habits of a fiduciary. It is not a legal status. A client who wants a formal fiduciary should work with a registered investment adviser, not a metals dealer.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'What if a firm refuses to give me a written estimate?',
        'Treat the refusal as a signal. A firm that will not pre-commit to its own terms on paper is asking the client to carry the full risk of any later drift. A client can decline the deal and ask another firm. Most firms that will not write the terms down will lose the client to one that will.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'Is accountability the same as being a fiduciary?',
      answer:
        'No. A dealer is not a fiduciary under ERISA. Accountability is a conduct standard that mimics the habits of a fiduciary. It is not a legal status. A client who wants a formal fiduciary should work with a registered investment adviser.',
    },
    {
      question: 'What if a firm refuses to give me a written estimate?',
      answer:
        'Treat the refusal as a signal. A firm that will not pre-commit to its own terms on paper is asking the client to carry the full risk of later drift. A client can decline the deal and ask another firm.',
    },
  ],
}
