import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.about.editorial-guidelines',
  pillar: 'about',
  slug: 'editorial-guidelines',
  title: 'Editorial Guidelines and Fact-Checking Process',
  summary:
    'How The Gold IRA Guide commissions, reviews, fact-checks, and updates every article. The protocol covers primary-source verification and a quarterly freshness audit.',
  metaTitle: 'Editorial Guidelines and Fact-Checking',
  metaDescription:
    'Every article on The Gold IRA Guide is written by a credentialed human author and fact-checked against IRS, CFTC, and SEC primary sources before publication.',
  schemaJsonLdType: 'Article',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: [
    'about/about-the-guide',
    'about/ftc-disclosures',
    'about/expert-authors',
  ],
  citations: [
    citation('irs-590a'),
    citation('finra-metals'),
    citation('ftc-endorsement-guides'),
  ],
  body: [
    block(
      'intro',
      p(
        'Every article published on The Gold IRA Guide is written by a named human expert. The editorial team commissions, reviews, and audits each piece before it is posted. No article is drafted as primary content by an automated system. Human authorship carries through the research, the drafting, and the final review. That is the floor the hub works from.',
      ),
    ),
    block(
      'intro-2',
      p(
        'The editorial protocol has three parts. The first is sourcing. The second is fact-checking. The third is the update cadence. Each part is documented below so a reader can compare what the hub claims with what each article contains. A reader who finds a gap is invited to report it through the contact form linked in the footer of every page.',
      ),
    ),
    block('h2-authorship', h2('Who writes the articles')),
    block(
      'authorship-1',
      p(
        'Each article has a named author. Each author has a public profile on the site. The profile lists their credentials, their industry tenure, and their areas of expertise. The profile also links to a verified external source, most often a LinkedIn page, where a reader can confirm the biographical claims. The editorial team selects authors based on direct experience with precious metals, retirement accounts, or federal tax rules.',
      ),
    ),
    block(
      'authorship-2',
      p(
        'Authors work with an editor. The editor is responsible for checking the structure of the article, the clarity of the writing, and the accuracy of every citation. The editor is separate from the author. An author cannot sign off on their own piece. A second set of eyes is a rule, not a courtesy. That split is the first line of defense against errors that a single writer can miss.',
      ),
    ),
    block('h2-fact-check', h2('Our fact-checking protocol')),
    block(
      'fact-1',
      p(
        'Fact-checking is the second stage. The editor runs each factual claim against a primary source. A claim about contribution limits is checked against the current year of Internal Revenue Service Publication 590-A. A claim about distribution rules is checked against Publication 590-B. A claim about eligible metals is checked against Internal Revenue Code section 408(m) and 31 U.S.C. 5112.',
      ),
    ),
    block(
      'fact-2',
      p(
        'Claims about dealer conduct are checked against the FINRA investor bulletin on physical metals, the CFTC fraud advisories, and any active notices from the SEC or state regulators. Claims about advertising and endorsement conduct are checked against the 2023 FTC Endorsement Guides at 16 CFR Part 255. Every citation that appears in an article has been opened, read, and matched to the sentence it supports.',
      ),
    ),
    block(
      'fact-3',
      p(
        'A secondary source, such as an industry white paper or a news report, may appear as context. It is never the sole basis for a factual claim. If the underlying primary source cannot be located, the sentence is rewritten or removed. That standard applies to tax figures, to fee ranges, and to historical price data alike. The citation list at the bottom of each article is the working record of that check.',
      ),
    ),
    block(
      'callout-primary',
      callout(
        'info',
        'A claim without a primary source is not published. If the IRS, CFTC, SEC, or FINRA record for a statement cannot be located, the statement is rewritten or removed before the article is posted.',
      ),
    ),
    block('h2-updates', h2('How we update content')),
    block(
      'update-1',
      p(
        'Every article is reviewed on a quarterly cadence. The review checks four areas. First, whether any tax figure in the article has been revised by the Internal Revenue Service. Second, whether any cited regulation has been amended. Third, whether any price range or fee range cited in the piece has drifted outside the stated band. Fourth, whether any cited external source has moved or been retired.',
      ),
    ),
    block(
      'update-2',
      p(
        'When a revision is needed, the edit is made, the updated date is changed on the article, and a short note is added to the change log at the bottom of the piece. The change log is not hidden. A reader can see the full history of every substantive edit. That record is part of the accountability posture of the hub. It lets a returning reader confirm what has been revised and when.',
      ),
    ),
    block(
      'update-3',
      p(
        'Spot price references are a special case. The hub avoids posting a single live spot price in the body of an article, because such a number is out of date within hours. When a figure is needed for an example, it is framed as a round number for illustration, with a clear note that it is a teaching example. That choice keeps the articles useful across quarters rather than minutes.',
      ),
    ),
    block('h2-corrections', h2('Corrections and reader reports')),
    block(
      'corrections-1',
      p(
        'A reader who finds an error can report it. The contact form in the footer routes reports to the editorial inbox. The editor acknowledges the report within five business days. If the report identifies a real error, the article is revised, the updated date is advanced, and the change log records the correction. The reader who flagged the error receives a follow-up note.',
      ),
    ),
    block(
      'corrections-2',
      p(
        'Corrections are not silent. A reader should be able to tell at a glance that an article has been revised and why. The hub treats the public record of its own mistakes as part of the editorial product. A reader who sees a hub willing to post its revisions is reading a hub that treats its own work with the standard it asks dealers to meet.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'Do you use AI to draft articles?',
        'No. Primary content is drafted by named human authors with credentials relevant to the topic. Editorial tools may be used for search or grammar checks. They are not used to generate article prose. Every sentence in every article has a human author and a human editor behind it.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'How often is the content reviewed after publication?',
        'Every article is reviewed on a quarterly cadence. The review checks tax figures, cited regulations, fee ranges, and the health of every external source. Revisions are posted with an updated date and a change log entry so a reader can see the history of edits on any page.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'Do you use AI to draft articles?',
      answer:
        'No. Primary content is drafted by named human authors with credentials relevant to the topic. Editorial tools may be used for search or grammar checks. They are not used to generate article prose.',
    },
    {
      question: 'How often is the content reviewed after publication?',
      answer:
        'Every article is reviewed on a quarterly cadence. The review checks tax figures, cited regulations, fee ranges, and external source health. Revisions are posted with an updated date and a change log entry.',
    },
  ],
}
