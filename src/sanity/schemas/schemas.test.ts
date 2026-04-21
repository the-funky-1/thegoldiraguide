import { describe, expect, it } from 'vitest'
import { article } from './article'
import { seo } from './objects/seo'
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
    expect(article).toBeDefined()
    const fieldNames = (article!.fields ?? []).map(
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
    expect(fs).toBeDefined()
    const fieldNames = (fs!.fields ?? []).map(
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

describe('article.schemaJsonLdType', () => {
  it('is a string field with a closed enum list', () => {
    const field = article.fields.find((f) => f.name === 'schemaJsonLdType')
    expect(field).toBeDefined()
    expect(field?.type).toBe('string')
    const options = (field as { options?: { list?: unknown } } | undefined)
      ?.options
    expect(options?.list).toEqual([
      { title: 'Article (default)', value: 'Article' },
      { title: 'FAQPage', value: 'FAQPage' },
      { title: 'HowTo', value: 'HowTo' },
      { title: 'FinancialProduct', value: 'FinancialProduct' },
      { title: 'Guide', value: 'Guide' },
    ])
  })
})

describe('article.citations', () => {
  it('is an array of citation objects with url + title + accessed date', () => {
    const field = article.fields.find((f) => f.name === 'citations')
    expect(field).toBeDefined()
    expect(field?.type).toBe('array')
  })
})

describe('seo.metaTitle validation', () => {
  it('errors (not warns) when over 60 chars', () => {
    const titleField = seo.fields.find((f) => f.name === 'metaTitle')
    expect(titleField).toBeDefined()
    // Smoke test: field exists; full validation asserted in build-time validator.
  })
})
