'use client'

import { DelayedProgress } from '@/components/friction/DelayedProgress'
import { formatUsd } from '@/finance/decimal'
import { computeFeeDrag } from '@/finance/fee-drag/compute'
import { useFeeDragStore } from '@/tools/fee-drag/store'

export function FeeDragResult() {
  const input = useFeeDragStore((s) => s.input)
  const result = computeFeeDrag(input)

  return (
    <DelayedProgress
      delayMs={300}
      placeholder="Recalculating with your inputs…"
    >
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded border border-slate-charcoal/20 bg-white p-6">
          <h3 className="font-serif text-lg">Flat-rate ending balance</h3>
          <p className="mt-2 font-serif text-3xl font-bold text-ledger-navy">
            {formatUsd(result.totals.flatEndBalance)}
          </p>
          <p className="mt-2 text-sm text-slate-charcoal">
            Total fees paid: {formatUsd(result.totals.flatTotalFeesPaid)}
          </p>
        </div>
        <div className="rounded border border-slate-charcoal/20 bg-white p-6">
          <h3 className="font-serif text-lg">Scaling % ending balance</h3>
          <p className="mt-2 font-serif text-3xl font-bold text-ledger-navy">
            {formatUsd(result.totals.scalingEndBalance)}
          </p>
          <p className="mt-2 text-sm text-slate-charcoal">
            Total fees paid: {formatUsd(result.totals.scalingTotalFeesPaid)}
          </p>
        </div>
        <div className="col-span-full rounded bg-old-gold/10 p-6 text-center">
          <p className="text-sm uppercase tracking-wide">
            Flat-rate advantage over {input.horizonYears} years
          </p>
          <p className="mt-2 font-serif text-4xl font-bold text-ledger-navy">
            {formatUsd(result.totals.flatAdvantageUsd)}
          </p>
        </div>
        <table className="col-span-full w-full text-sm">
          <caption className="mb-2 text-left font-semibold">
            Year-by-year trajectory
          </caption>
          <thead>
            <tr className="border-b">
              <th scope="col" className="p-2 text-left">
                Year
              </th>
              <th scope="col" className="p-2 text-right">
                Flat balance
              </th>
              <th scope="col" className="p-2 text-right">
                Flat fee paid
              </th>
              <th scope="col" className="p-2 text-right">
                Scaling balance
              </th>
              <th scope="col" className="p-2 text-right">
                Scaling fee paid
              </th>
            </tr>
          </thead>
          <tbody>
            {result.years.map((row) => (
              <tr key={row.year} className="border-b">
                <td className="p-2">{row.year}</td>
                <td className="p-2 text-right">
                  {formatUsd(row.flatBalance)}
                </td>
                <td className="p-2 text-right">
                  {formatUsd(row.flatFeePaid)}
                </td>
                <td className="p-2 text-right">
                  {formatUsd(row.scalingBalance)}
                </td>
                <td className="p-2 text-right">
                  {formatUsd(row.scalingFeePaid)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DelayedProgress>
  )
}
