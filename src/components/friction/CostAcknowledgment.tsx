'use client'

import { useState } from 'react'

export function CostAcknowledgment({
  label,
  formattedCost,
  costPlainDigits,
  onContinue,
}: {
  label: string
  formattedCost: string
  costPlainDigits: string
  onContinue: () => void
}) {
  const [typed, setTyped] = useState('')
  const matches = typed.replace(/[\s,$.]/g, '') === costPlainDigits

  return (
    <div className="rounded border-2 border-old-gold bg-platinum p-6">
      <p className="text-sm uppercase tracking-wide text-slate-charcoal">
        {label}
      </p>
      <p className="mt-1 font-serif text-3xl font-bold text-ledger-navy">
        {formattedCost}
      </p>
      <p className="mt-4 text-sm">
        To ensure you have absorbed this number, please type the figure (digits
        only) to continue.
      </p>
      <label className="mt-2 block text-sm font-medium">
        Type the number exactly
        <input
          type="text"
          inputMode="numeric"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          className="mt-1 block w-full rounded border border-slate-charcoal/40 p-2"
        />
      </label>
      <button
        type="button"
        disabled={!matches}
        onClick={onContinue}
        className="mt-4 inline-flex min-h-[44px] items-center rounded bg-ledger-navy px-4 py-2 text-sm font-semibold text-platinum disabled:cursor-not-allowed disabled:opacity-50"
      >
        I acknowledge this cost and want to continue
      </button>
    </div>
  )
}
