import { defineField, defineType } from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      validation: (r) =>
        r.required().max(60).error('Meta title must be 60 characters or fewer'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (r) =>
        r.required().max(160).error('Meta description must be 160 characters or fewer'),
    }),
    defineField({
      name: 'noIndex',
      title: 'No-index',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
