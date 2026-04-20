import { describe, expect, it } from 'vitest'
import { ALL_SEEDS, seedsByPillar } from './index'
import { ArticleSeedSchema } from './types'
import { extractPlainText, fleschKincaidGrade } from './reading-level'

describe('ALL_SEEDS', () => {
  it('has exactly 25 seeds', () => {
    expect(ALL_SEEDS).toHaveLength(25)
  })

  it('has 5 seeds per pillar', () => {
    const counts = seedsByPillar()
    expect(counts['ira-rules']).toHaveLength(5)
    expect(counts['accountability']).toHaveLength(5)
    expect(counts['economics']).toHaveLength(5)
    expect(counts['tools']).toHaveLength(5)
    expect(counts['about']).toHaveLength(5)
  })

  it('every seed parses under the Zod schema', () => {
    for (const seed of ALL_SEEDS) {
      expect(() => ArticleSeedSchema.parse(seed), seed._id).not.toThrow()
    }
  })

  it('every seed has reading level between 6.5 and 8.5', () => {
    for (const seed of ALL_SEEDS) {
      const text = extractPlainText(seed.body)
      const grade = fleschKincaidGrade(text)
      expect(grade, `${seed._id} grade=${grade.toFixed(2)}`).toBeGreaterThanOrEqual(6.5)
      expect(grade, `${seed._id} grade=${grade.toFixed(2)}`).toBeLessThanOrEqual(8.5)
    }
  })

  it('every _id is unique', () => {
    const ids = ALL_SEEDS.map((s) => s._id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every cross-link points to a real seed', () => {
    const refs = new Set(ALL_SEEDS.map((s) => `${s.pillar}/${s.slug}`))
    for (const seed of ALL_SEEDS) {
      for (const link of seed.crossLinks) {
        expect(refs.has(link), `${seed._id} → ${link}`).toBe(true)
      }
    }
  })
})
