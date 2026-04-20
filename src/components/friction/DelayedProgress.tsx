'use client'

import { useEffect, useState } from 'react'

export function DelayedProgress({
  delayMs,
  placeholder,
  children,
}: {
  delayMs: number
  placeholder: string
  children: React.ReactNode
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setReady(true), delayMs)
    return () => clearTimeout(id)
  }, [delayMs])

  if (!ready) {
    return (
      <p
        role="status"
        aria-live="polite"
        className="text-sm text-brand-slate"
      >
        {placeholder}
      </p>
    )
  }
  return <>{children}</>
}
