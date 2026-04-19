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
