'use client'

import { ChartDataTable } from '@/components/charts/ChartDataTable'
import { DelayedProgress } from '@/components/friction/DelayedProgress'
import { formatUsd } from '@/finance/decimal'
import { computeRmd } from '@/finance/rmd/compute'
import { useRmdStore } from '@/tools/rmd/store'

export function RmdResult() {
  const input = useRmdStore((s) => s.input)
  const result = computeRmd(input)

  const rows = [
    {
      line: 'Age at year-end',
      value: String(result.ageAtYearEnd),
      note: `${input.distributionYear} minus ${input.birthYear}`,
    },
    {
      line: 'Required beginning age',
      value: String(result.requiredBeginningAge),
      note: 'Based on birth-year threshold under current SECURE 2.0 rules',
    },
    {
      line: 'IRS divisor',
      value: result.divisor ? result.divisor.toFixed(1) : 'Not required',
      note: 'Uniform Lifetime Table divisor for the distribution year age',
    },
    {
      line: 'Estimated RMD',
      value: formatUsd(result.estimatedRmdUsd),
      note: result.rmdRequired
        ? 'Prior year-end value divided by divisor'
        : 'No RMD indicated for this age and year',
    },
  ]

  return (
    <DelayedProgress delayMs={250} placeholder="Recalculating RMD estimate...">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded border border-brand-slate/20 bg-white p-4">
          <h3 className="text-sm text-brand-slate">Estimated RMD</h3>
          <p className="mt-2 font-serif text-3xl font-bold text-brand-navy">
            {formatUsd(result.estimatedRmdUsd)}
          </p>
        </div>
        <div className="rounded border border-brand-slate/20 bg-white p-4">
          <h3 className="text-sm text-brand-slate">IRS divisor</h3>
          <p className="mt-2 font-serif text-3xl font-bold text-brand-navy">
            {result.divisor ? result.divisor.toFixed(1) : 'N/A'}
          </p>
        </div>
        <div className="rounded border border-brand-slate/20 bg-white p-4">
          <h3 className="text-sm text-brand-slate">Monthly set-aside</h3>
          <p className="mt-2 font-serif text-3xl font-bold text-brand-navy">
            {formatUsd(result.monthlySetAsideUsd)}
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <ChartDataTable
          caption="RMD estimate calculation"
          columns={[
            { key: 'line', label: 'Line item' },
            { key: 'value', label: 'Value', align: 'right' },
            { key: 'note', label: 'Method' },
          ]}
          rows={rows}
        />
      </div>

      <p className="mt-6 max-w-3xl text-sm text-brand-slate">
        This estimator uses the IRS Uniform Lifetime Table for a non-inherited
        IRA owner. It does not cover every inherited IRA, spouse beneficiary,
        plan-specific, tax, or penalty rule.
      </p>
    </DelayedProgress>
  )
}
