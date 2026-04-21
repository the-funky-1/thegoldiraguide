import { defineField, defineType } from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'pillar',
      type: 'reference',
      to: [{ type: 'pillar' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (r) => r.required(),
    }),
    defineField({ name: 'reviewedBy', type: 'reviewedBy' }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'updatedAt',
      type: 'datetime',
      description: 'Emitted as schema.org dateModified.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 3,
      validation: (r) => r.max(320),
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        { type: 'block' },
        defineField({
          name: 'callout',
          type: 'object',
          fields: [
            {
              name: 'tone',
              type: 'string',
              options: { list: ['info', 'warning', 'danger'] },
            },
            { name: 'body', type: 'text', rows: 3 },
          ],
        }),
        defineField({
          name: 'faq',
          type: 'object',
          fields: [
            {
              name: 'question',
              type: 'string',
              validation: (r) => r.required(),
            },
            {
              name: 'answer',
              type: 'text',
              rows: 4,
              validation: (r) => r.required(),
            },
          ],
        }),
        defineField({
          name: 'feeTable',
          type: 'object',
          fields: [
            {
              name: 'rows',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'feeSchedule' }] }],
            },
          ],
        }),
        defineField({
          name: 'llmsOnly',
          type: 'object',
          title: 'LLM-only block (hidden from humans)',
          fields: [
            {
              name: 'children',
              type: 'array',
              of: [{ type: 'block' }],
            },
          ],
        }),
        defineField({
          name: 'llmsIgnore',
          type: 'object',
          title: 'Human-only block (stripped from LLM mirrors)',
          fields: [
            {
              name: 'children',
              type: 'array',
              of: [{ type: 'block' }],
            },
          ],
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: 'seo', type: 'seo' }),
    defineField({
      name: 'schemaJsonLdType',
      title: 'Schema.org JSON-LD type',
      type: 'string',
      description:
        'Controls which schema.org type is emitted. Defaults to Article. FAQPage requires at least one faq block in the body. HowTo requires a stepwise structure.',
      initialValue: 'Article',
      options: {
        list: [
          { title: 'Article (default)', value: 'Article' },
          { title: 'FAQPage', value: 'FAQPage' },
          { title: 'HowTo', value: 'HowTo' },
          { title: 'FinancialProduct', value: 'FinancialProduct' },
          { title: 'Guide', value: 'Guide' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'citations',
      title: 'Citations',
      type: 'array',
      description:
        'External sources cited in the body. Rendered as a "Works cited" list at the bottom of the article and emitted as schema.org citation.',
      of: [
        defineField({
          name: 'citation',
          type: 'object',
          fields: [
            { name: 'label', type: 'string', validation: (r) => r.required() },
            { name: 'url', type: 'url', validation: (r) => r.required() },
            {
              name: 'accessed',
              type: 'date',
              description: 'Date the source was last verified.',
              validation: (r) => r.required(),
            },
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', pillar: 'pillar.title', updatedAt: 'updatedAt' },
    prepare({ title, pillar, updatedAt }) {
      return {
        title,
        subtitle: `${pillar ?? '—'} · updated ${updatedAt?.slice(0, 10) ?? '—'}`,
      }
    },
  },
})
