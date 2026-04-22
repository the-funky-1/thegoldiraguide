'use client'

import { bucketToolInput } from '@/analytics/buckets'
import { analyticsEvents, analyticsToolIds } from '@/analytics/events'
import { trackAnalyticsEvent } from '@/analytics/track'
import type { RmdInput } from '@/finance/rmd/schema'
import { useRmdStore } from '@/tools/rmd/store'

type FieldKey = keyof RmdInput

export function RmdForm() {
  const { input, setInput, reset } = useRmdStore()

  const trackField = (key: FieldKey, value: number) => {
    trackAnalyticsEvent(analyticsEvents.toolInputChanged, {
      field_key: key,
      tool_id: analyticsToolIds.rmdEstimator,
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
          setInput({ [key]: Number(e.target.value) } as Partial<RmdInput>)
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
      className="grid gap-4 md:grid-cols-3"
    >
      {field('Birth year', 'birthYear', '1', '1900', '2100')}
      {field('Distribution year', 'distributionYear', '1', '2026', '2100')}
      {field(
        'Prior year-end IRA value (USD)',
        'priorYearEndBalanceUsd',
        '100',
        '0',
        '100000000',
      )}
      <button
        type="button"
        onClick={() => {
          trackAnalyticsEvent(analyticsEvents.toolReset, {
            tool_id: analyticsToolIds.rmdEstimator,
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
