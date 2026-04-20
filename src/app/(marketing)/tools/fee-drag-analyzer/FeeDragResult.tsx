'use client'

import { StackedAreaChart } from '@/components/charts/StackedAreaChart'
import { WaterfallChart } from '@/components/charts/WaterfallChart'
import { DelayedProgress } from '@/components/friction/DelayedProgress'
import { formatUsd } from '@/finance/decimal'
import { computeFeeDrag } from '@/finance/fee-drag/compute'
import { useFeeDragStore } from '@/tools/fee-drag/store'

export function FeeDragResult() {
  const input = useFeeDragStore((s) => s.input)
  const result = computeFeeDrag(input)

  const series = [
    {
      id: 'flat',
      label: 'Flat-rate balance',
      points: result.years.map((row) => ({
        x: row.year,
        y: Number(row.flatBalance.toFixed(2)),
      })),
    },
    {
      id: 'scaling',
      label: 'Scaling % balance',
      points: result.years.map((row) => ({
        x: row.year,
        y: Number(row.scalingBalance.toFixed(2)),
      })),
    },
  ]

  const waterfallSteps = [
    { label: 'Principal', delta: input.startingBalanceUsd },
    {
      label: 'Setup fee',
      delta: -input.oneTimeSetupFeeUsd,
      tone: 'negative' as const,
    },
    {
      label: 'Scaling fees paid',
      delta: -Number(
        result.totals.scalingTotalFeesPaid
          .minus(input.oneTimeSetupFeeUsd)
          .toFixed(2),
      ),
      tone: 'negative' as const,
    },
    {
      label: 'Appreciation + compounding',
      delta: Number(
        result.totals.scalingEndBalance
          .minus(input.startingBalanceUsd)
          .plus(result.totals.scalingTotalFeesPaid)
          .toFixed(2),
      ),
      tone: 'positive' as const,
    },
  ]

  return (
    <DelayedProgress
      delayMs={300}
      placeholder="Recalculating with your inputs…"
    >
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded border border-brand-slate/20 bg-white p-6">
          <h3 className="font-serif text-lg">Flat-rate ending balance</h3>
          <p className="mt-2 font-serif text-3xl font-bold text-brand-navy">
            {formatUsd(result.totals.flatEndBalance)}
          </p>
          <p className="mt-2 text-sm text-brand-slate">
            Total fees paid: {formatUsd(result.totals.flatTotalFeesPaid)}
          </p>
        </div>
        <div className="rounded border border-brand-slate/20 bg-white p-6">
          <h3 className="font-serif text-lg">Scaling % ending balance</h3>
          <p className="mt-2 font-serif text-3xl font-bold text-brand-navy">
            {formatUsd(result.totals.scalingEndBalance)}
          </p>
          <p className="mt-2 text-sm text-brand-slate">
            Total fees paid: {formatUsd(result.totals.scalingTotalFeesPaid)}
          </p>
        </div>
        <div className="col-span-full rounded bg-brand-gold/10 p-6 text-center">
          <p className="text-sm uppercase tracking-wide">
            Flat-rate advantage over {input.horizonYears} years
          </p>
          <p className="mt-2 font-serif text-4xl font-bold text-brand-navy">
            {formatUsd(result.totals.flatAdvantageUsd)}
          </p>
        </div>
      </div>

      <StackedAreaChart
        title="Balance trajectory (flat vs scaling)"
        description="Projected year-end balance under each fee structure."
        xLabel="Year"
        yLabel="Balance (USD)"
        series={series}
        formatValue={(n) => formatUsd(n)}
      />

      <WaterfallChart
        title="Scaling-scenario cost attribution"
        description="Principal, one-time setup, cumulative fees, and net appreciation."
        steps={waterfallSteps}
        formatValue={(n) => formatUsd(n)}
      />
    </DelayedProgress>
  )
}
