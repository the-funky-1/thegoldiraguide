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
      validation: (r) => r.max(70).warning('Keep under 70 characters'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (r) => r.max(160).warning('Keep under 160 characters'),
    }),
    defineField({
      name: 'noIndex',
      title: 'No-index',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
