import { defineField, defineType } from 'sanity'

export const reviewedBy = defineType({
  name: 'reviewedBy',
  title: 'Reviewed by',
  type: 'object',
  fields: [
    defineField({
      name: 'reviewer',
      title: 'Reviewer',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'reviewedAt',
      title: 'Reviewed at',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
  ],
})
