import type { ArticleSeed, PillarSlug } from './types'
import { registerArticle } from './cross-links'

import { seed as iraRules1 } from './ira-rules/eligible-metals'
import { seed as iraRules2 } from './ira-rules/collectible-prohibition'
import { seed as iraRules3 } from './ira-rules/depository-storage'
import { seed as iraRules4 } from './ira-rules/rollover-mechanics'
import { seed as iraRules5 } from './ira-rules/home-storage-fallacy'

import { seed as accountability1 } from './accountability/transactional-spreads'
import { seed as accountability2 } from './accountability/flat-vs-scaling-fees'
import { seed as accountability3 } from './accountability/written-estimate'
import { seed as accountability4 } from './accountability/bullion-vs-numismatic'
import { seed as accountability5 } from './accountability/promotional-offers'

import { seed as economics1 } from './economics/fiat-devaluation'
import { seed as economics2 } from './economics/physical-vs-etfs'
import { seed as economics3 } from './economics/supply-demand-industrial'
import { seed as economics4 } from './economics/portfolio-volatility'
import { seed as economics5 } from './economics/capital-gains-non-ira'

import { seed as tools1 } from './tools/fee-drag-analyzer'
import { seed as tools2 } from './tools/live-spot-prices'
import { seed as tools3 } from './tools/spread-markup-calculator'
import { seed as tools4 } from './tools/rmd-estimator'
import { seed as tools5 } from './tools/correlation-matrix'

import { seed as about1 } from './about/about-the-guide'
import { seed as about2 } from './about/editorial-guidelines'
import { seed as about3 } from './about/ftc-disclosures'
import { seed as about4 } from './about/accountability-standard'
import { seed as about5 } from './about/expert-authors'

import { seed as reviewSeed } from './reviews/top-gold-ira-companies'
import { seed as cryptoSeed } from './crypto/bitcoin-ira-guide'
import { seed as metalsSeed } from './metals/silver-ira-guide'
import { seed as plansSeed } from './plans/roth-ira-gold'

export const ALL_SEEDS: ArticleSeed[] = [
  iraRules1,
  iraRules2,
  iraRules3,
  iraRules4,
  iraRules5,
  accountability1,
  accountability2,
  accountability3,
  accountability4,
  accountability5,
  economics1,
  economics2,
  economics3,
  economics4,
  economics5,
  tools1,
  tools2,
  tools3,
  tools4,
  tools5,
  about1,
  about2,
  about3,
  about4,
  about5,
  reviewSeed,
  cryptoSeed,
  metalsSeed,
  plansSeed,
]

for (const seed of ALL_SEEDS) {
  registerArticle(`${seed.pillar}/${seed.slug}`)
}

export function seedsByPillar(): Record<PillarSlug, ArticleSeed[]> {
  const by: Record<PillarSlug, ArticleSeed[]> = {
    'ira-rules': [],
    accountability: [],
    economics: [],
    tools: [],
    about: [],
    reviews: [],
    crypto: [],
    metals: [],
    plans: [],
  }
  for (const s of ALL_SEEDS) by[s.pillar].push(s)
  return by
}
