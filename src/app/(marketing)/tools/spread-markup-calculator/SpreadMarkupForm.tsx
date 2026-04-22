'use client'

import { bucketToolInput } from '@/analytics/buckets'
import { analyticsEvents, analyticsToolIds } from '@/analytics/events'
import { trackAnalyticsEvent } from '@/analytics/track'
import { SpotPriceInline } from '@/components/market/SpotPriceInline'
import type { SpreadMarkupInput } from '@/finance/spread-markup/schema'
import { METAL_KEYS, type MetalKey } from '@/market/schema'
import { useSpotPrice } from '@/market/use-spot-price'
import { useSpreadMarkupStore } from '@/tools/spread-markup/store'

type FieldKey = Exclude<keyof SpreadMarkupInput, 'metal'>

function PrefillSpotButton({ metal }: { metal: MetalKey }) {
  const setInput = useSpreadMarkupStore((s) => s.setInput)
  const { data } = useSpotPrice(metal)
  if (!data) return null

  return (
    <button
      type="button"
      onClick={() => {
        trackAnalyticsEvent(analyticsEvents.toolPrefillUsed, {
          metal,
          source: 'live_spot_price',
          tool_id: analyticsToolIds.spreadMarkupCalculator,
        })
        setInput({ spotPricePerOunceUsd: Number(data.pricePerOunceUsd) })
      }}
      className="inline-flex min-h-touch items-center gap-1 rounded border border-brand-slate/40 px-4 py-2 text-sm"
    >
      <span>Use {metal} spot price: </span>
      <SpotPriceInline metal={metal} />
    </button>
  )
}

export function SpreadMarkupForm() {
  const { input, setInput, reset } = useSpreadMarkupStore()

  const trackField = (key: FieldKey, value: number) => {
    trackAnalyticsEvent(analyticsEvents.toolInputChanged, {
      field_key: key,
      tool_id: analyticsToolIds.spreadMarkupCalculator,
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
          setInput({
            [key]: Number(e.target.value),
          } as Partial<SpreadMarkupInput>)
        }
        onBlur={(e) => trackField(key, Number(e.currentTarget.value))}
        className="mt-1 block min-h-touch w-full rounded border border-brand-slate/40 p-2"
        aria-label={label}
      />
    </label>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <PrefillSpotButton metal={input.metal} />
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="grid gap-4 md:grid-cols-2"
      >
        <label className="block text-sm">
          Metal
          <select
            value={input.metal}
            onChange={(e) => {
              const metal = e.target.value as MetalKey
              setInput({ metal })
              trackAnalyticsEvent(analyticsEvents.toolInputChanged, {
                field_key: 'metal',
                metal,
                tool_id: analyticsToolIds.spreadMarkupCalculator,
                value_bucket: 'provided',
              })
            }}
            className="mt-1 block min-h-touch w-full rounded border border-brand-slate/40 p-2 capitalize"
            aria-label="Metal"
          >
            {METAL_KEYS.map((metal) => (
              <option key={metal} value={metal}>
                {metal}
              </option>
            ))}
          </select>
        </label>
        {field('Spot price per ounce (USD)', 'spotPricePerOunceUsd', '0.01', '0.01')}
        {field('Product ounces', 'productOunces', '0.01', '0.01')}
        {field('Quantity', 'quantity', '1', '1', '10000')}
        {field('Quoted unit price (USD)', 'quotedUnitPriceUsd', '0.01', '0.01')}
        {field('Fixed dealer fee (USD)', 'fixedDealerFeeUsd', '1', '0')}
        <button
          type="button"
          onClick={() => {
            trackAnalyticsEvent(analyticsEvents.toolReset, {
              tool_id: analyticsToolIds.spreadMarkupCalculator,
            })
            reset()
          }}
          className="inline-flex min-h-touch items-center self-start rounded border border-brand-slate/40 px-4 py-2 text-sm"
        >
          Reset to defaults
        </button>
      </form>
    </div>
  )
}
