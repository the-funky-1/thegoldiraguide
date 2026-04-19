import { defineField, defineType } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'jobTitle', type: 'string' }),
    defineField({ name: 'bio', type: 'text', rows: 5 }),
    defineField({ name: 'portrait', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'credentials',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'expertCredential' }] }],
    }),
    defineField({
      name: 'socialProfiles',
      type: 'array',
      of: [
        defineField({
          name: 'profile',
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              options: {
                list: [
                  'linkedin',
                  'twitter',
                  'sec-iapd',
                  'finra-brokercheck',
                  'other',
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'url',
              type: 'url',
              validation: (r) => r.required().uri({ scheme: ['https'] }),
            }),
          ],
        }),
      ],
    }),
  ],
})
