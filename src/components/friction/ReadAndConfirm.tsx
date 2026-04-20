'use client'

import { useState } from 'react'

export function ReadAndConfirm({
  title,
  body,
  onConfirm,
}: {
  title: string
  body: string
  onConfirm: () => void
}) {
  const [acknowledged, setAcknowledged] = useState(false)
  return (
    <div
      role="group"
      aria-label={title}
      className="rounded border border-brand-slate/20 bg-white p-6"
    >
      <h3 className="font-serif text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed">{body}</p>
      <label className="mt-4 flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5"
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
        />
        <span>I have read and understood the statement above.</span>
      </label>
      <button
        type="button"
        disabled={!acknowledged}
        onClick={onConfirm}
        className="mt-4 inline-flex min-h-touch items-center rounded bg-brand-navy px-4 py-2 text-sm font-semibold text-brand-platinum disabled:cursor-not-allowed disabled:opacity-50"
      >
        Confirm
      </button>
    </div>
  )
}
