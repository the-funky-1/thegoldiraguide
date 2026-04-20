// Paul Tol qualitative palette — safe for protanopia, deuteranopia, tritanopia.
// Source: https://personal.sron.nl/~pault/
export const CHART_PALETTE = [
  '#332288', // indigo
  '#117733', // green
  '#DDCC77', // sand
  '#CC6677', // rose
  '#AA4499', // purple
  '#88CCEE', // sky
] as const

export const PATTERN_IDS = CHART_PALETTE.map((_, i) => `chart-pattern-${i}`)

export function chartSeriesColor(index: number): string {
  return CHART_PALETTE[Math.abs(index) % CHART_PALETTE.length]!
}

export function chartSeriesPatternId(index: number): string {
  return PATTERN_IDS[Math.abs(index) % PATTERN_IDS.length]!
}

// Deterministic SVG pattern definitions consumed by chart components.
export function svgPatternDefs(): string {
  return `
    <defs>
      ${CHART_PALETTE.map(
        (color, i) => `
        <pattern id="${PATTERN_IDS[i]}" patternUnits="userSpaceOnUse" width="8" height="8">
          ${
            i % 3 === 0
              ? `<line x1="0" y1="0" x2="8" y2="8" stroke="${color}" stroke-width="2"/>`
              : i % 3 === 1
                ? `<circle cx="4" cy="4" r="2" fill="${color}"/>`
                : `<rect width="4" height="4" fill="${color}"/>`
          }
          <rect width="8" height="8" fill="${color}" opacity="0.35"/>
        </pattern>
      `,
      ).join('')}
    </defs>
  `
}
