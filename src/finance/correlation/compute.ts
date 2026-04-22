export type AssetId = 'gold' | 'silver' | 'sp500' | 'bonds' | 'cash'
export type TimeframeId = 'three-year' | 'ten-year' | 'stress'

export type AssetReturnSeries = {
  id: AssetId
  label: string
  returns: number[]
}

export type TimeframeReturnSet = {
  id: TimeframeId
  label: string
  note: string
  series: AssetReturnSeries[]
}

export const SAMPLE_RETURN_SETS: readonly TimeframeReturnSet[] = [
  {
    id: 'three-year',
    label: '3-year sample',
    note: 'Educational monthly-return sample for a shorter comparison window.',
    series: [
      { id: 'gold', label: 'Gold', returns: [1.1, -0.7, 2.0, 0.4, -1.2, 1.5, 0.8, -0.3, 1.7, -0.9, 0.6, 1.0] },
      { id: 'silver', label: 'Silver', returns: [1.8, -1.4, 3.1, 0.7, -2.0, 2.4, 1.3, -0.8, 2.6, -1.6, 1.0, 1.8] },
      { id: 'sp500', label: 'S&P 500', returns: [0.9, 1.4, -0.6, 1.8, 0.5, -1.2, 2.1, 0.6, -0.4, 1.2, 1.7, -0.3] },
      { id: 'bonds', label: 'U.S. Bonds', returns: [0.2, -0.1, 0.4, -0.2, 0.3, 0.1, -0.3, 0.2, 0.1, -0.2, 0.3, 0.2] },
      { id: 'cash', label: 'Cash', returns: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3] },
    ],
  },
  {
    id: 'ten-year',
    label: '10-year sample',
    note: 'Educational monthly-return sample for a longer comparison window.',
    series: [
      { id: 'gold', label: 'Gold', returns: [0.8, -1.1, 1.9, -0.4, 0.6, 1.3, -0.9, 2.2, -1.5, 0.7, 1.0, -0.2] },
      { id: 'silver', label: 'Silver', returns: [1.2, -2.0, 3.4, -0.8, 1.1, 2.0, -1.7, 3.8, -2.4, 1.3, 1.8, -0.5] },
      { id: 'sp500', label: 'S&P 500', returns: [1.5, 0.8, -1.0, 2.1, 1.0, -0.6, 1.9, -1.4, 0.7, 1.6, 0.9, -0.2] },
      { id: 'bonds', label: 'U.S. Bonds', returns: [0.4, 0.2, 0.6, -0.1, 0.3, 0.5, -0.2, 0.4, 0.1, 0.3, 0.2, 0.4] },
      { id: 'cash', label: 'Cash', returns: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2] },
    ],
  },
  {
    id: 'stress',
    label: 'Stress sample',
    note: 'Educational sample shaped around equity drawdown months.',
    series: [
      { id: 'gold', label: 'Gold', returns: [2.4, 1.6, -0.5, 3.0, 0.9, -1.1, 2.2, 1.3, -0.4, 2.8, 0.7, 1.1] },
      { id: 'silver', label: 'Silver', returns: [3.2, 2.1, -1.2, 4.4, 1.4, -2.3, 3.6, 2.0, -1.0, 4.1, 1.2, 1.8] },
      { id: 'sp500', label: 'S&P 500', returns: [-4.5, -2.8, 1.2, -5.2, 0.6, 2.1, -3.9, -1.7, 1.0, -4.8, 0.4, -2.0] },
      { id: 'bonds', label: 'U.S. Bonds', returns: [1.1, 0.9, 0.2, 1.4, 0.3, -0.1, 1.0, 0.8, 0.1, 1.3, 0.3, 0.6] },
      { id: 'cash', label: 'Cash', returns: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2] },
    ],
  },
] as const

export type CorrelationCell = {
  rowId: AssetId
  columnId: AssetId
  rowLabel: string
  columnLabel: string
  value: number
}

function mean(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function pearsonCorrelation(
  a: readonly number[],
  b: readonly number[],
): number {
  if (a.length !== b.length || a.length === 0) {
    throw new Error('Correlation series must have equal non-zero length')
  }

  const meanA = mean(a)
  const meanB = mean(b)
  let numerator = 0
  let sumSquaresA = 0
  let sumSquaresB = 0

  for (let i = 0; i < a.length; i++) {
    const deltaA = (a[i] ?? 0) - meanA
    const deltaB = (b[i] ?? 0) - meanB
    numerator += deltaA * deltaB
    sumSquaresA += deltaA * deltaA
    sumSquaresB += deltaB * deltaB
  }

  const denominator = Math.sqrt(sumSquaresA * sumSquaresB)
  if (denominator === 0) return 0
  return numerator / denominator
}

export function correlationMatrix(
  set: TimeframeReturnSet,
): CorrelationCell[] {
  return set.series.flatMap((row) =>
    set.series.map((column) => ({
      rowId: row.id,
      columnId: column.id,
      rowLabel: row.label,
      columnLabel: column.label,
      value:
        row.id === column.id
          ? 1
          : Number(pearsonCorrelation(row.returns, column.returns).toFixed(2)),
    })),
  )
}

export function getReturnSet(id: TimeframeId): TimeframeReturnSet {
  return SAMPLE_RETURN_SETS.find((set) => set.id === id) ?? SAMPLE_RETURN_SETS[0]!
}
