export type Rgb = { r: number; g: number; b: number }

export function hexToRgb(hex: string): Rgb {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  const num = parseInt(full, 16)
  return { r: (num >> 16) & 0xff, g: (num >> 8) & 0xff, b: num & 0xff }
}

function srgbToLuminanceChannel(c: number): number {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

function relativeLuminance({ r, g, b }: Rgb): number {
  return (
    0.2126 * srgbToLuminanceChannel(r) +
    0.7152 * srgbToLuminanceChannel(g) +
    0.0722 * srgbToLuminanceChannel(b)
  )
}

export function contrastRatio(hexA: string, hexB: string): number {
  const la = relativeLuminance(hexToRgb(hexA))
  const lb = relativeLuminance(hexToRgb(hexB))
  const lighter = Math.max(la, lb)
  const darker = Math.min(la, lb)
  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100
}

export function passesAa(ratio: number, size: 'normal' | 'large'): boolean {
  return ratio >= (size === 'large' ? 3 : 4.5)
}

export function passesAaa(ratio: number, size: 'normal' | 'large'): boolean {
  return ratio >= (size === 'large' ? 4.5 : 7)
}
