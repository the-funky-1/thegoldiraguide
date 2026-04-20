import type { ArticleSeed } from '../types'
import { citation } from '../citations'
import { block, callout, faq, h2, p } from '../pt'

export const seed: ArticleSeed = {
  _id: 'article.about.expert-authors',
  pillar: 'about',
  slug: 'expert-authors',
  title: 'Our Editorial Team and Financial Experts',
  summary:
    'How The Gold IRA Guide vets and credentials the authors behind every article, and what a reader can expect to find on an author profile page.',
  metaTitle: 'Our Editorial Team and Financial Experts',
  metaDescription:
    'How The Gold IRA Guide vets and credentials the authors behind every article, and what a reader can expect to find on an author profile page.',
  schemaJsonLdType: 'Article',
  publishedAt: '2026-04-19',
  updatedAt: '2026-04-19',
  authorSlug: 'jane',
  crossLinks: [
    'about/editorial-guidelines',
    'about/accountability-standard',
  ],
  citations: [citation('ftc-endorsement-guides')],
  body: [
    block(
      'intro',
      p(
        'The Gold IRA Guide is written by people. Each article has a named author. Each author has a public profile on the site. The profile tells a reader who the author is, what they have done, and where a reader can verify those claims. This page explains how the hub credentials its authors and what to look for on any profile page.',
      ),
    ),
    block(
      'intro-2',
      p(
        'The individual author profiles live at a predictable address on the site. Each profile sits at a consistent path that reads slash about slash expert authors slash the author slug. A reader can reach any profile directly from the byline of any article on the hub. The profiles are indexed so that search engines can crawl and display them publicly, which matters for the authoritativeness signals the hub accumulates over time.',
      ),
    ),
    block('h2-profile', h2('What appears on an author profile')),
    block(
      'profile-1',
      p(
        'Each profile has four sections. The first section is a short biography. It names the author. It states the current role on the team. It lists past jobs in finance, metals, retirement planning, or regulatory work. The editor reads the bio before it goes up.',
      ),
    ),
    block(
      'profile-2',
      p(
        'The second section lists credentials. These are earned titles such as a Certified Financial Planner, a Chartered Financial Analyst, a certified public accountant, a state bar admission, or a registered rep status with FINRA. The list holds only titles that can be checked in a public registry. A title that cannot be looked up is not listed.',
      ),
    ),
    block(
      'profile-3',
      p(
        'The third section states tenure. It gives the number of years the author has worked in finance, the areas of focus, and the types of clients served. Tenure is shown as a range, such as more than ten years in retirement planning. The range shows depth of work. It is not a full résumé of past jobs.',
      ),
    ),
    block(
      'profile-4',
      p(
        'The fourth section is a link for the reader to check. It points to a public page, most often a LinkedIn profile. A reader can confirm the name, the employer, and the bio against that page. The editor checks the link before the profile goes live. A broken link is fixed before the author is credited on any article.',
      ),
    ),
    block(
      'callout-verification',
      callout(
        'info',
        'Every author profile includes a verifiable external link. A reader who wants to confirm the biographical record can follow that link to a public professional profile. The hub treats this link as part of the profile, not as an optional extra.',
      ),
    ),
    block('h2-selection', h2('How we select authors')),
    block(
      'selection-1',
      p(
        'The team picks authors based on direct work in one of four areas. The first area is federal tax rules for retirement accounts. That work draws on IRS Publications 590-A and 590-B. The second area is the flow of a metals deal. That covers premiums, spreads, and the roles of the dealer, the custodian, and the depository.',
      ),
    ),
    block(
      'selection-2',
      p(
        'The third area is the design of a retirement account. That covers IRAs, employer plans, and rollover steps. The fourth area is rules and conduct. That covers the FTC Endorsement Guides, FINRA bulletins, and state notices. An author is picked when the tenure and the titles match the topic. A broad finance background alone is not enough.',
      ),
    ),
    block(
      'selection-3',
      p(
        'Each author signs a short letter. The letter sets the topic, the due date, and the fact-check steps. It also states that the parent firm does not read the article before it posts. The editor holds the letter on file. It is part of the paper trail that backs the editorial guidelines page.',
      ),
    ),
    block('h2-eeat', h2('Why human expertise matters for trust')),
    block(
      'eeat-1',
      p(
        'Search engines use a framework often short-handed as E-E-A-T. It stands for experience, expertise, authority, and trust. The framework asks whether an article was written by someone who has done the work, or only read about it. The hub takes that bar to heart. The credential list, the tenure range, and the check link all speak to it.',
      ),
    ),
    block(
      'eeat-2',
      p(
        'Human skill also matters for readers, apart from search rank. A reader making a choice about a retirement account wants to know who wrote the page. A named author with a public profile is a stronger signal than a house byline. The profile is part of the accountability posture of the hub. It lets a reader hold one person to the record.',
      ),
    ),
    block(
      'eeat-3',
      p(
        'The hub does not post author profiles as a marketing tool. The profiles hold real data that can be checked against public lists. A profile that cannot be checked is not posted. A profile that is posted is backed by a signed letter on file with the editor.',
      ),
    ),
    block('h2-updates', h2('Keeping profiles current')),
    block(
      'updates-1',
      p(
        'Author profiles are systematically reviewed on the same quarterly cadence established for the articles. The review confirms that every credential listed remains active, that the external verification link still resolves correctly, and that the current role description remains accurate. When an author departs the hub, the profile is archived with a dated note explaining the transition. The articles the author previously wrote remain attributed, because the historical byline represents part of the permanent public record.',
      ),
    ),
    block(
      'updates-2',
      p(
        'A reader who notices a stale profile can report it through the contact form. The editor acknowledges the report within five business days and opens a review. This is the same path that runs for article corrections. Profile accuracy is treated with the same seriousness as article accuracy because both support the trust a reader places in the hub.',
      ),
    ),
    block('h2-faq', h2('Frequently asked questions')),
    block(
      'faq-1',
      faq(
        'Where do I find the full list of authors?',
        'The roster lives at the expert authors index page. Each entry links to a profile page at slash about slash expert authors slash the author slug. A reader can also reach any profile from the byline of any article on the hub by clicking the author name.',
      ),
    ),
    block(
      'faq-2',
      faq(
        'Can I verify an author outside the site?',
        'Yes. Every profile includes a verification link to a public external profile, most often a LinkedIn page. A reader can click that link and compare the name, the employer, and the biographical record against what appears on the hub.',
      ),
    ),
  ],
  faqs: [
    {
      question: 'Where do I find the full list of authors?',
      answer:
        'The roster lives at the expert authors index page. Each entry links to a profile page at slash about slash expert authors slash the author slug. Readers can also reach any profile from an article byline.',
    },
    {
      question: 'Can I verify an author outside the site?',
      answer:
        'Yes. Every profile includes a verification link to a public external profile, most often a LinkedIn page. Readers can click that link and compare the name, the employer, and the biographical record against the hub.',
    },
  ],
}
