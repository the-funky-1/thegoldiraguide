'use client'

import { bucketToolInput } from '@/analytics/buckets'
import { analyticsEvents, analyticsToolIds } from '@/analytics/events'
import { trackAnalyticsEvent } from '@/analytics/track'
import type { FeeDragInput } from '@/finance/fee-drag/schema'
import { useFeeDragStore } from '@/tools/fee-drag/store'

type FieldKey = keyof FeeDragInput

export function FeeDragForm() {
  const { input, setInput, reset } = useFeeDragStore()
  const trackField = (key: FieldKey, value: number) => {
    trackAnalyticsEvent(analyticsEvents.toolInputChanged, {
      field_key: key,
      tool_id: analyticsToolIds.feeDragAnalyzer,
      value_bucket: bucketToolInput(key, value),
    })
  }

  const field = (
    label: string,
    key: FieldKey,
    step = '1',
    min = '0',
    max?: string,
  ) => (
    <label key={key} className="block text-sm">
      {label}
      <input
        type="number"
        step={step}
        min={min}
        max={max}
        value={input[key]}
        onChange={(e) =>
          setInput({ [key]: Number(e.target.value) } as Partial<FeeDragInput>)
        }
        onBlur={(e) => trackField(key, Number(e.currentTarget.value))}
        className="mt-1 block min-h-touch w-full rounded border border-brand-slate/40 p-2"
        aria-label={label}
      />
    </label>
  )
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid gap-4 md:grid-cols-2"
    >
      {field(
        'Starting balance (USD)',
        'startingBalanceUsd',
        '100',
        '1000',
        '10000000',
      )}
      {field('Horizon (years)', 'horizonYears', '1', '1', '50')}
      {field('Annual return %', 'annualReturnPercent', '0.1', '-10', '20')}
      {field(
        'One-time setup fee (USD)',
        'oneTimeSetupFeeUsd',
        '1',
        '0',
        '10000',
      )}
      <fieldset className="col-span-full rounded border border-brand-slate/20 p-4">
        <legend className="px-1 text-sm font-semibold">
          Flat-rate scenario
        </legend>
        <div className="mt-2 grid gap-4 md:grid-cols-2">
          {field('Flat annual admin fee (USD)', 'flatAnnualAdminFeeUsd')}
          {field('Flat annual storage fee (USD)', 'flatAnnualStorageFeeUsd')}
        </div>
      </fieldset>
      <fieldset className="col-span-full rounded border border-brand-slate/20 p-4">
        <legend className="px-1 text-sm font-semibold">
          Scaling percentage scenario
        </legend>
        <div className="mt-2 grid gap-4 md:grid-cols-2">
          {field('Scaling annual admin fee (USD)', 'scalingAnnualAdminFeeUsd')}
          {field(
            'Scaling storage %',
            'scalingAnnualStoragePercent',
            '0.05',
            '0',
            '5',
          )}
        </div>
      </fieldset>
      <button
        type="button"
        onClick={() => {
          trackAnalyticsEvent(analyticsEvents.toolReset, {
            tool_id: analyticsToolIds.feeDragAnalyzer,
          })
          reset()
        }}
        className="inline-flex min-h-touch items-center self-start rounded border border-brand-slate/40 px-4 py-2 text-sm"
      >
        Reset to defaults
      </button>
    </form>
  )
}
