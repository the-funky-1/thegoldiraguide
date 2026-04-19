import { defineField, defineType } from 'sanity'

export const editorialGuidelines = defineType({
  name: 'editorialGuidelines',
  title: 'Editorial guidelines (singleton)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Editorial guidelines',
    }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'lastReviewedAt',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
  ],
})
