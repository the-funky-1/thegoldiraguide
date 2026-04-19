'use client'

import { useState } from 'react'
import { CostAcknowledgment } from '@/components/friction/CostAcknowledgment'
import { DelayedProgress } from '@/components/friction/DelayedProgress'
import { formatPercent, formatUsd } from '@/finance/decimal'
import { computeRoi } from '@/finance/roi/compute'
import { useRoiStore } from '@/tools/roi/store'

export function RoiResult() {
  const input = useRoiStore((s) => s.input)
  const result = computeRoi(input)
  const [acknowledged, setAcknowledged] = useState(false)
  const highFeeRatio = result.totalFeesUsd
    .dividedBy(input.principalUsd)
    .greaterThan(0.2)

  return (
    <DelayedProgress delayMs={300} placeholder="Recalculating…">
      {highFeeRatio && !acknowledged && (
        <CostAcknowledgment
          label="Projected total fee burden"
          formattedCost={formatUsd(result.totalFeesUsd)}
          costPlainDigits={result.totalFeesUsd.toFixed(0).replace('-', '')}
          onContinue={() => setAcknowledged(true)}
        />
      )}

      {(!highFeeRatio || acknowledged) && (
        <dl className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded border border-slate-charcoal/20 bg-white p-4">
            <dt className="text-sm text-slate-charcoal">
              Net starting position
            </dt>
            <dd className="font-serif text-2xl">
              {formatUsd(result.netStartingPositionUsd)}
            </dd>
          </div>
          <div className="rounded border border-slate-charcoal/20 bg-white p-4">
            <dt className="text-sm text-slate-charcoal">
              Gross terminal (no spreads/fees)
            </dt>
            <dd className="font-serif text-2xl">
              {formatUsd(result.grossTerminalValueUsd)}
            </dd>
          </div>
          <div className="rounded border border-slate-charcoal/20 bg-white p-4">
            <dt className="text-sm text-slate-charcoal">
              Net terminal (after all fees)
            </dt>
            <dd className="font-serif text-2xl">
              {formatUsd(result.netTerminalValueUsd)}
            </dd>
          </div>
          <div className="rounded border border-slate-charcoal/20 bg-white p-4">
            <dt className="text-sm text-slate-charcoal">Net gain</dt>
            <dd className="font-serif text-2xl">
              {formatUsd(result.netGainUsd)}
            </dd>
          </div>
          <div className="rounded border border-slate-charcoal/20 bg-white p-4">
            <dt className="text-sm text-slate-charcoal">Net CAGR</dt>
            <dd className="font-serif text-2xl">
              {formatPercent(result.netCagrPercent.dividedBy(100))}
            </dd>
          </div>
          <div className="rounded border border-slate-charcoal/20 bg-white p-4">
            <dt className="text-sm text-slate-charcoal">Total fees paid</dt>
            <dd className="font-serif text-2xl">
              {formatUsd(result.totalFeesUsd)}
            </dd>
          </div>
        </dl>
      )}
    </DelayedProgress>
  )
}
