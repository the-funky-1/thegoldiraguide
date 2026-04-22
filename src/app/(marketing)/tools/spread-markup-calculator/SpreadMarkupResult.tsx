'use client'

import { ChartDataTable } from '@/components/charts/ChartDataTable'
import { DelayedProgress } from '@/components/friction/DelayedProgress'
import { formatPercent, formatUsd } from '@/finance/decimal'
import { computeSpreadMarkup } from '@/finance/spread-markup/compute'
import { useSpreadMarkupStore } from '@/tools/spread-markup/store'

export function SpreadMarkupResult() {
  const input = useSpreadMarkupStore((s) => s.input)
  const result = computeSpreadMarkup(input)
  const markupRatio = result.markupPercent.dividedBy(100)

  const rows = [
    {
      line: 'Intrinsic metal value',
      value: formatUsd(result.intrinsicTotalValueUsd),
      note: `${result.totalOunces.toFixed(2)} total ounces at ${formatUsd(input.spotPricePerOunceUsd)} per ounce`,
    },
    {
      line: 'Quoted total',
      value: formatUsd(result.quotedTotalUsd),
      note: `${input.quantity} units plus any fixed dealer fee`,
    },
    {
      line: 'Markup',
      value: formatUsd(result.markupUsd),
      note: `${formatPercent(markupRatio, 2)} above intrinsic metal value`,
    },
    {
      line: 'Markup per ounce',
      value: formatUsd(result.markupPerOunceUsd),
      note: 'Dollar markup divided by total ounces',
    },
  ]

  return (
    <DelayedProgress delayMs={250} placeholder="Recalculating quoted spread...">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded border border-brand-slate/20 bg-white p-4">
          <h3 className="text-sm text-brand-slate">Dollar markup</h3>
          <p className="mt-2 font-serif text-3xl font-bold text-brand-navy">
            {formatUsd(result.markupUsd)}
          </p>
        </div>
        <div className="rounded border border-brand-slate/20 bg-white p-4">
          <h3 className="text-sm text-brand-slate">Markup percentage</h3>
          <p className="mt-2 font-serif text-3xl font-bold text-brand-navy">
            {formatPercent(markupRatio, 2)}
          </p>
        </div>
        <div className="rounded border border-brand-slate/20 bg-white p-4">
          <h3 className="text-sm text-brand-slate">Markup per ounce</h3>
          <p className="mt-2 font-serif text-3xl font-bold text-brand-navy">
            {formatUsd(result.markupPerOunceUsd)}
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <ChartDataTable
          caption="Spread and markup calculation"
          columns={[
            { key: 'line', label: 'Line item' },
            { key: 'value', label: 'Value', align: 'right' },
            { key: 'note', label: 'Method' },
          ]}
          rows={rows}
        />
      </div>

      <p className="mt-6 max-w-3xl text-sm text-brand-slate">
        Require this markup, the product description, storage terms, and all
        fixed fees in a written estimate before relying on a quoted transaction.
      </p>
    </DelayedProgress>
  )
}
