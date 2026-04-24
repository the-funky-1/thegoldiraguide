import { HomeHero } from '@/components/home/HomeHero'
import { PillarBento } from '@/components/home/PillarBento'
import { SignalStrip } from '@/components/home/SignalStrip'
import { ALL_SEEDS } from '@/content/strategic'
import { PUBLIC_TOOL_PAGES } from '@/content/tools/public-tools'

function computeLastUpdatedIso(): string {
  const dates = ALL_SEEDS.map((s) => s.updatedAt ?? s.publishedAt).filter(
    (d): d is string => typeof d === 'string',
  )
  if (dates.length === 0) return new Date().toISOString()
  return dates.sort().at(-1) ?? new Date().toISOString()
}

export default function HomePage() {
  const articleCount = ALL_SEEDS.length
  const toolCount = PUBLIC_TOOL_PAGES.length
  const lastUpdatedIso = computeLastUpdatedIso()

  return (
    <>
      <HomeHero />
      <SignalStrip
        articleCount={articleCount}
        toolCount={toolCount}
        lastUpdatedIso={lastUpdatedIso}
      />
      <PillarBento />
    </>
  )
}
