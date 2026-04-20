export type SeriesPoint = { x: string | number; y: number }

export type Series = {
  id: string
  label: string
  points: SeriesPoint[]
}

export type WaterfallStep = {
  label: string
  delta: number
  tone?: 'positive' | 'negative' | 'neutral'
}
