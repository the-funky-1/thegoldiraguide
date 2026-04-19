import { defineField, defineType } from 'sanity'

export const expertCredential = defineType({
  name: 'expertCredential',
  title: 'Expert credential',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'credentialCategory',
      type: 'string',
      options: { list: ['degree', 'license', 'certification'] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'recognizedBy',
      type: 'string',
      description:
        'Issuing body — e.g., FINRA, CFP Board, Harvard Law School',
    }),
    defineField({ name: 'dateEarned', type: 'date' }),
    defineField({ name: 'verificationUrl', type: 'url' }),
  ],
})
