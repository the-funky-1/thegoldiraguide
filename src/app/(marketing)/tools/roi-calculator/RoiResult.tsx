'use client'

import { useState } from 'react'
import { bucketRatio, bucketUsdAmount } from '@/analytics/buckets'
import { analyticsEvents, analyticsToolIds } from '@/analytics/events'
import { trackAnalyticsEvent } from '@/analytics/track'
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
  const handleHighFeeAcknowledgment = () => {
    trackAnalyticsEvent(analyticsEvents.frictionAcknowledged, {
      fee_ratio_bucket: bucketRatio(
        result.totalFeesUsd.dividedBy(input.principalUsd).toNumber(),
      ),
      friction_type: 'high_fee_ratio',
      projected_fee_bucket: bucketUsdAmount(result.totalFeesUsd.toNumber()),
      tool_id: analyticsToolIds.roiCalculator,
    })
    setAcknowledged(true)
  }

  return (
    <DelayedProgress delayMs={300} placeholder="Recalculating…">
      {highFeeRatio && !acknowledged && (
        <CostAcknowledgment
          label="Projected total fee burden"
          formattedCost={formatUsd(result.totalFeesUsd)}
          costPlainDigits={result.totalFeesUsd.toFixed(0).replace('-', '')}
          onContinue={handleHighFeeAcknowledgment}
        />
      )}

      {(!highFeeRatio || acknowledged) && (
        <dl className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded border border-brand-slate/20 bg-white p-4">
            <dt className="text-sm text-brand-slate">
              Net starting position
            </dt>
            <dd className="font-serif text-2xl">
              {formatUsd(result.netStartingPositionUsd)}
            </dd>
          </div>
          <div className="rounded border border-brand-slate/20 bg-white p-4">
            <dt className="text-sm text-brand-slate">
              Gross terminal (no spreads/fees)
            </dt>
            <dd className="font-serif text-2xl">
              {formatUsd(result.grossTerminalValueUsd)}
            </dd>
          </div>
          <div className="rounded border border-brand-slate/20 bg-white p-4">
            <dt className="text-sm text-brand-slate">
              Net terminal (after all fees)
            </dt>
            <dd className="font-serif text-2xl">
              {formatUsd(result.netTerminalValueUsd)}
            </dd>
          </div>
          <div className="rounded border border-brand-slate/20 bg-white p-4">
            <dt className="text-sm text-brand-slate">Net gain</dt>
            <dd className="font-serif text-2xl">
              {formatUsd(result.netGainUsd)}
            </dd>
          </div>
          <div className="rounded border border-brand-slate/20 bg-white p-4">
            <dt className="text-sm text-brand-slate">Net CAGR</dt>
            <dd className="font-serif text-2xl">
              {formatPercent(result.netCagrPercent.dividedBy(100))}
            </dd>
          </div>
          <div className="rounded border border-brand-slate/20 bg-white p-4">
            <dt className="text-sm text-brand-slate">Total fees paid</dt>
            <dd className="font-serif text-2xl">
              {formatUsd(result.totalFeesUsd)}
            </dd>
          </div>
        </dl>
      )}
    </DelayedProgress>
  )
}
