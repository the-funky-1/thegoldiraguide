import { defineField, defineType } from 'sanity'

export const pillar = defineType({
  name: 'pillar',
  title: 'Pillar',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'summary', type: 'text', rows: 3 }),
    defineField({
      name: 'order',
      type: 'number',
      description: '1..5 — controls nav order',
      validation: (r) => r.required().integer().min(1).max(5),
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
})
