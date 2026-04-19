'use client'

import type { RoiInput } from '@/finance/roi/schema'
import { useRoiStore } from '@/tools/roi/store'

type FieldKey = keyof RoiInput

export function RoiForm() {
  const { input, setInput, reset } = useRoiStore()
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
          setInput({ [key]: Number(e.target.value) } as Partial<RoiInput>)
        }
        className="mt-1 block min-h-[44px] w-full rounded border border-slate-charcoal/40 p-2"
        aria-label={label}
      />
    </label>
  )
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid gap-4 md:grid-cols-2"
    >
      {field('Principal (USD)', 'principalUsd', '100', '1000', '10000000')}
      {field('Horizon (years)', 'horizonYears', '1', '1', '50')}
      {field(
        'Annual appreciation %',
        'annualAppreciationPercent',
        '0.1',
        '-10',
        '20',
      )}
      {field('Purchase spread %', 'purchaseSpreadPercent', '0.1', '0', '50')}
      {field(
        'Liquidation spread %',
        'liquidationSpreadPercent',
        '0.1',
        '0',
        '50',
      )}
      {field('Annual fees (USD)', 'annualFeesUsd', '1', '0', '10000')}
      <button
        type="button"
        onClick={reset}
        className="inline-flex min-h-[44px] items-center self-start rounded border border-slate-charcoal/40 px-4 py-2 text-sm"
      >
        Reset to defaults
      </button>
    </form>
  )
}
