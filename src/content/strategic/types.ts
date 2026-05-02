import { z } from 'zod'

export const PILLAR_SLUGS = [
  'ira-rules',
  'accountability',
  'economics',
  'tools',
  'about',
  'reviews',
  'crypto',
  'metals',
  'plans',
] as const

export const SCHEMA_TYPES = [
  'Article',
  'FAQPage',
  'HowTo',
  'FinancialProduct',
  'Guide',
] as const

const CrossLinkSchema = z
  .string()
  .regex(
    /^(ira-rules|accountability|economics|tools|about|reviews|crypto|metals|plans)\/[a-z0-9-]+$/,
    'crossLinks must be <pillar>/<slug>',
  )

const FaqSchema = z.object({
  question: z.string().min(8).max(200),
  answer: z.string().min(20).max(600),
})

const CitationSchema = z.object({
  label: z.string().min(4),
  url: z.string().url(),
  accessed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export const ArticleSeedSchema = z
  .object({
    _id: z.string().regex(/^article\.[a-z-]+\.[a-z0-9-]+$/),
    pillar: z.enum(PILLAR_SLUGS),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(10).max(120),
    summary: z.string().min(40).max(320),
    metaTitle: z
      .string()
      .min(10)
      .max(60, 'metaTitle must be 60 chars or fewer'),
    metaDescription: z
      .string()
      .min(50)
      .max(160, 'metaDescription must be 160 chars or fewer'),
    schemaJsonLdType: z.enum(SCHEMA_TYPES),
    publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    authorSlug: z.string().regex(/^[a-z0-9-]+$/),
    body: z
      .array(
        z
          .object({ _key: z.string().min(1), _type: z.string().min(1) })
          .passthrough(),
      )
      .min(1),
    faqs: z.array(FaqSchema),
    crossLinks: z.array(CrossLinkSchema).min(1),
    citations: z
      .array(CitationSchema)
      .min(1, 'citations: at least one citation is required'),
  })
  .superRefine((data, ctx) => {
    if (data.schemaJsonLdType === 'FAQPage' && data.faqs.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['faqs'],
        message: 'FAQPage requires at least one faq block',
      })
    }
    if (!data._id.endsWith(`.${data.pillar}.${data.slug}`)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['_id'],
        message: '_id must be article.<pillar>.<slug>',
      })
    }
  })

export type ArticleSeed = z.infer<typeof ArticleSeedSchema>
export type PillarSlug = (typeof PILLAR_SLUGS)[number]
export type SchemaJsonLdType = (typeof SCHEMA_TYPES)[number]
