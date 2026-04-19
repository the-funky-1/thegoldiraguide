import { describe, expect, it } from 'vitest'
import { schemaTypes } from './index'

const byName = Object.fromEntries(schemaTypes.map((s) => [s.name, s]))

describe('schema registry', () => {
  it('contains every required document and object type', () => {
    const expected = [
      'article',
      'author',
      'editorialGuidelines',
      'expertCredential',
      'feeSchedule',
      'pillar',
      'reviewedBy',
      'seo',
    ]
    for (const name of expected) expect(byName[name]).toBeDefined()
  })

  it('article requires title, slug, pillar, author, publishedAt, updatedAt, body', () => {
    const article = byName.article
    const fieldNames = (article.fields ?? []).map(
      (f) => (f as { name: string }).name,
    )
    for (const f of [
      'title',
      'slug',
      'pillar',
      'author',
      'publishedAt',
      'updatedAt',
      'body',
    ]) {
      expect(fieldNames).toContain(f)
    }
  })

  it('feeSchedule carries structured numerical fee fields', () => {
    const fs = byName.feeSchedule
    const fieldNames = (fs.fields ?? []).map(
      (f) => (f as { name: string }).name,
    )
    for (const f of [
      'setupFeeUsd',
      'annualAdminFeeUsd',
      'storageModel',
      'typicalPurchaseSpreadPercent',
      'typicalLiquidationSpreadPercent',
      'dataVerifiedAt',
    ]) {
      expect(fieldNames).toContain(f)
    }
  })
})
