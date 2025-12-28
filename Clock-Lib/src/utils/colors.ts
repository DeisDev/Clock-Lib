export function colorToCss(rgbString: string): string {
  if (typeof rgbString !== 'string') return 'rgb(255,255,255)'
  const parts = rgbString.trim().split(/\s+/).map(Number)
  const [r, g, b] = parts.length >= 3 ? parts : [1, 1, 1]
  const to255 = (v: number) => Math.round(Math.max(0, Math.min(1, Number.isFinite(v) ? v : 1)) * 255)
  return `rgb(${to255(r)}, ${to255(g)}, ${to255(b)})`
}

export function colorToCssWithAlpha(rgbString: string, alpha = 1): string {
  if (typeof rgbString !== 'string') return `rgba(255,255,255,${alpha})`
  const parts = rgbString.trim().split(/\s+/).map(Number)
  const [r, g, b] = parts.length >= 3 ? parts : [1, 1, 1]
  const clampAlpha = Math.max(0, Math.min(1, Number(alpha) || 0))
  const to255 = (v: number) => Math.round(Math.max(0, Math.min(1, Number.isFinite(v) ? v : 1)) * 255)
  return `rgba(${to255(r)}, ${to255(g)}, ${to255(b)}, ${clampAlpha})`
}

export function hexToRgbString(hex: string): string {
  if (!hex || !hex.startsWith('#')) return '1 1 1'
  const fullHex = hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex
  const r = parseInt(fullHex.slice(1, 3), 16) / 255
  const g = parseInt(fullHex.slice(3, 5), 16) / 255
  const b = parseInt(fullHex.slice(5, 7), 16) / 255
  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}`
}

export function rgbStringToHex(rgbString: string): string {
  if (typeof rgbString !== 'string') return '#ffffff'
  const parts = rgbString.trim().split(/\s+/).map(Number)
  const [r, g, b] = parts.length >= 3 ? parts : [1, 1, 1]
  const to255 = (v: number) => Math.round(Math.max(0, Math.min(1, Number.isFinite(v) ? v : 1)) * 255)
  return `#${to255(r).toString(16).padStart(2, '0')}${to255(g).toString(16).padStart(2, '0')}${to255(b).toString(16).padStart(2, '0')}`
}

export function parseRgbString(rgbString: string): [number, number, number] {
  if (typeof rgbString !== 'string') return [1, 1, 1]
  const parts = rgbString.trim().split(/\s+/).map(Number)
  return parts.length >= 3 ? [parts[0], parts[1], parts[2]] : [1, 1, 1]
}

export function createGradientCss(
  startColor: string,
  endColor: string,
  angle: number
): string {
  const start = colorToCss(startColor)
  const end = colorToCss(endColor)
  return `linear-gradient(${angle}deg, ${start}, ${end})`
}

export function createShadowCss(
  color: string,
  blur: number,
  distance: number,
  angle: number,
  opacity: number
): string {
  const shadowColor = colorToCssWithAlpha(color, opacity)
  const angleRad = (angle * Math.PI) / 180
  const offsetX = Math.cos(angleRad) * distance
  const offsetY = Math.sin(angleRad) * distance
  return `${offsetX.toFixed(1)}px ${offsetY.toFixed(1)}px ${blur}px ${shadowColor}`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function clamp01(value: number): number {
  return clamp(value, 0, 1)
}
