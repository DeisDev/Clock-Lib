import type { FontDefinition } from '@/types'

export const CLOCK_FONTS: FontDefinition[] = [
  { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', stack: "'Inter', 'Segoe UI', system-ui, sans-serif", name: 'Inter' },
  { href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap', stack: "'Space Grotesk', 'Segoe UI', system-ui, sans-serif", name: 'Space Grotesk' },
  { href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap', stack: "'DM Sans', 'Segoe UI', system-ui, sans-serif", name: 'DM Sans' },
  { href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&display=swap', stack: "'Roboto Mono', 'SFMono-Regular', monospace", name: 'Roboto Mono' },
  { href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap', stack: "'Manrope', 'Segoe UI', system-ui, sans-serif", name: 'Manrope' },
  { href: 'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap', stack: "'Sora', 'Segoe UI', system-ui, sans-serif", name: 'Sora' },
  { href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap', stack: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif", name: 'Plus Jakarta Sans' },
  { href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap', stack: "'Poppins', 'Segoe UI', system-ui, sans-serif", name: 'Poppins' },
  { href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap', stack: "'Outfit', 'Segoe UI', system-ui, sans-serif", name: 'Outfit' },
  { href: 'https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700&display=swap', stack: "'Urbanist', 'Segoe UI', system-ui, sans-serif", name: 'Urbanist' },
  { href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap', stack: "'Orbitron', 'Segoe UI', system-ui, sans-serif", name: 'Orbitron' },
  { href: 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap', stack: "'Raleway', 'Segoe UI', system-ui, sans-serif", name: 'Raleway' },
  { href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap', stack: "'JetBrains Mono', 'Consolas', monospace", name: 'JetBrains Mono' },
  { href: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap', stack: "'Fira Code', 'Consolas', monospace", name: 'Fira Code' },
  { href: 'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap', stack: "'Lexend', 'Segoe UI', system-ui, sans-serif", name: 'Lexend' },
  { stack: "Arial, Helvetica, sans-serif", name: 'Arial' },
  { stack: "Verdana, Geneva, sans-serif", name: 'Verdana' },
  { stack: "Tahoma, Geneva, sans-serif", name: 'Tahoma' },
  { stack: "'Trebuchet MS', Helvetica, sans-serif", name: 'Trebuchet MS' },
  { stack: "Georgia, 'Times New Roman', serif", name: 'Georgia' },
  { stack: "'Times New Roman', Times, serif", name: 'Times New Roman' },
  { stack: "'Courier New', Courier, monospace", name: 'Courier New' },
  { stack: "Impact, Charcoal, sans-serif", name: 'Impact' },
  { stack: "'Comic Sans MS', cursive, sans-serif", name: 'Comic Sans MS' },
  { stack: "'Segoe UI', system-ui, sans-serif", name: 'Segoe UI' }
]

const loadedFontLinks = new Set<string>()

export function ensureFontLoaded(index: number): string {
  const font = CLOCK_FONTS[index] || CLOCK_FONTS[0]
  if (!font.href) return font.stack
  if (loadedFontLinks.has(font.href)) return font.stack
  
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = font.href
  document.head.appendChild(link)
  loadedFontLinks.add(font.href)
  
  return font.stack
}

export function getFontStack(index: number): string {
  const font = CLOCK_FONTS[index] || CLOCK_FONTS[0]
  return font.stack
}

export function getFontName(index: number): string {
  const font = CLOCK_FONTS[index] || CLOCK_FONTS[0]
  return font.name || 'Unknown'
}

export function preloadFonts(indices: number[]): void {
  indices.forEach(index => ensureFontLoaded(index))
}
