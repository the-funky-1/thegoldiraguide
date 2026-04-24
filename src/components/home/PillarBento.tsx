import { PILLARS, pillarBySlug } from '@/lib/site-map'
import { FeaturedPillarCard } from './FeaturedPillarCard'
import { PillarCard } from './PillarCard'
import { FEATURED_PILLAR_SLUG } from './home-config'

export function PillarBento() {
  const featured = pillarBySlug(FEATURED_PILLAR_SLUG)
  if (!featured) return null
  const others = PILLARS.filter((p) => p.slug !== FEATURED_PILLAR_SLUG)

  return (
    <section
      aria-label="Pillars"
      className="mx-auto max-w-screen-xl px-6 py-16"
    >
      <div className="grid gap-6 md:grid-cols-3 md:grid-rows-2">
        <div className="md:col-span-2 md:row-span-2">
          <FeaturedPillarCard pillar={featured} />
        </div>
        {others.map((p) => (
          <PillarCard key={p.slug} pillar={p} />
        ))}
      </div>
    </section>
  )
}
