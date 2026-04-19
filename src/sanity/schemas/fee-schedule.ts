import { defineField, defineType } from 'sanity'

export const feeSchedule = defineType({
  name: 'feeSchedule',
  title: 'Fee schedule',
  type: 'document',
  description:
    'Our institutional fee schedule — the canonical written-estimate template that every calculator and JSON-LD payload references. Only Liberty Gold Silver documents are published; the platform never ingests competitor data.',
  fields: [
    defineField({
      name: 'dealerName',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'dealerName', maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'setupFeeUsd',
      type: 'number',
      validation: (r) => r.min(0),
    }),
    defineField({
      name: 'annualAdminFeeUsd',
      type: 'number',
      validation: (r) => r.min(0),
    }),
    defineField({
      name: 'storageModel',
      type: 'string',
      options: { list: ['flat', 'scaling'] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'storageFlatFeeUsd',
      type: 'number',
      validation: (r) => r.min(0),
      hidden: ({ parent }) => parent?.storageModel !== 'flat',
    }),
    defineField({
      name: 'storageScalingPercent',
      type: 'number',
      validation: (r) => r.min(0).max(5),
      hidden: ({ parent }) => parent?.storageModel !== 'scaling',
    }),
    defineField({
      name: 'typicalPurchaseSpreadPercent',
      type: 'number',
      validation: (r) => r.required().min(0).max(200),
    }),
    defineField({
      name: 'typicalLiquidationSpreadPercent',
      type: 'number',
      validation: (r) => r.required().min(0).max(200),
    }),
    defineField({ name: 'minimumInvestmentUsd', type: 'number' }),
    defineField({
      name: 'mandatorySalesCall',
      type: 'boolean',
      initialValue: true,
      description:
        'True if the dealer requires a phone call to complete a purchase.',
    }),
    defineField({
      name: 'sourceUrl',
      type: 'url',
      validation: (r) => r.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'dataVerifiedAt',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
  ],
})
