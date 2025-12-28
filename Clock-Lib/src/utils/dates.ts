import type { Holiday, HolidayResult } from '@/types'

export function getIsoWeek(date: Date): number {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = (tmp.getUTCDay() + 6) % 7
  tmp.setUTCDate(tmp.getUTCDate() - dayNum + 3)
  const firstThursday = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 4))
  const diff = tmp.getTime() - firstThursday.getTime()
  return 1 + Math.round(diff / 604800000)
}

export function nthWeekdayOfMonth(
  year: number,
  monthIndex: number,
  weekdayIndex: number,
  occurrence: number
): Date {
  const first = new Date(year, monthIndex, 1)
  const firstDay = first.getDay()
  const delta = (weekdayIndex - firstDay + 7) % 7
  const day = 1 + delta + (occurrence - 1) * 7
  return new Date(year, monthIndex, day)
}

export function computeEaster(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month, day)
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / 86400000)
}

export function daysDiff(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime()
  return Math.floor(ms / 86400000)
}

export function formatDhm(ms: number): { days: number; hours: number; minutes: number } {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000))
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60
  return { days, hours, minutes }
}

export function formatTime(
  date: Date,
  format: 12 | 24,
  showSeconds: boolean,
  separator: string
): { main: string; suffix: string } {
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = showSeconds ? `${separator}${date.getSeconds().toString().padStart(2, '0')}` : ''
  
  if (format === 12) {
    const h = hours % 12 || 12
    const suffix = hours >= 12 ? 'PM' : 'AM'
    return { main: `${h}${separator}${minutes}${seconds}`, suffix }
  }
  
  const h24 = hours.toString().padStart(2, '0')
  return { main: `${h24}${separator}${minutes}${seconds}`, suffix: '' }
}

export function formatDateValue(
  date: Date,
  format: 'words' | 'ymd' | 'mdy' | 'dmy' | 'custom',
  customFormat?: string
): string {
  const y = date.getFullYear()
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const d = date.getDate().toString().padStart(2, '0')
  
  switch (format) {
    case 'ymd':
      return `${y}-${m}-${d}`
    case 'mdy':
      return `${m}/${d}/${y}`
    case 'dmy':
      return `${d}/${m}/${y}`
    case 'custom':
      return formatCustomDate(date, customFormat || 'MMMM D, YYYY')
    default:
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  }
}

export function formatCustomDate(date: Date, format: string): string {
  const tokens: Record<string, string> = {
    'YYYY': date.getFullYear().toString(),
    'YY': date.getFullYear().toString().slice(-2),
    'MMMM': date.toLocaleDateString(undefined, { month: 'long' }),
    'MMM': date.toLocaleDateString(undefined, { month: 'short' }),
    'MM': (date.getMonth() + 1).toString().padStart(2, '0'),
    'M': (date.getMonth() + 1).toString(),
    'DDDD': date.toLocaleDateString(undefined, { weekday: 'long' }),
    'DDD': date.toLocaleDateString(undefined, { weekday: 'short' }),
    'DD': date.getDate().toString().padStart(2, '0'),
    'D': date.getDate().toString(),
    'HH': date.getHours().toString().padStart(2, '0'),
    'H': date.getHours().toString(),
    'hh': ((date.getHours() % 12) || 12).toString().padStart(2, '0'),
    'h': ((date.getHours() % 12) || 12).toString(),
    'mm': date.getMinutes().toString().padStart(2, '0'),
    'm': date.getMinutes().toString(),
    'ss': date.getSeconds().toString().padStart(2, '0'),
    's': date.getSeconds().toString(),
    'A': date.getHours() >= 12 ? 'PM' : 'AM',
    'a': date.getHours() >= 12 ? 'pm' : 'am'
  }
  
  let result = format
  for (const [token, value] of Object.entries(tokens).sort((a, b) => b[0].length - a[0].length)) {
    result = result.replace(new RegExp(token, 'g'), value)
  }
  return result
}

export const HOLIDAYS: Holiday[] = [
  { name: 'New Year', month: 1, day: 1, emoji: '🎉', greeting: 'Happy New Year!' },
  { name: "Valentine's Day", month: 2, day: 14, emoji: '❤️', greeting: "Happy Valentine's Day!" },
  { name: "International Women's Day", month: 3, day: 8, emoji: '🌷', greeting: "Happy Women's Day!" },
  { name: "April Fools' Day", month: 4, day: 1, emoji: '🤡', greeting: "Happy April Fools'!" },
  { name: 'Earth Day', month: 4, day: 22, emoji: '🌍', greeting: 'Happy Earth Day!' },
  { name: 'Labor Day', month: 5, day: 1, emoji: '🛠️', greeting: 'Happy Labor Day!' },
  { name: "Mother's Day", calc: (year) => nthWeekdayOfMonth(year, 4, 0, 2), emoji: '💐', greeting: "Happy Mother's Day!" },
  { name: "Father's Day", calc: (year) => nthWeekdayOfMonth(year, 5, 0, 3), emoji: '👔', greeting: "Happy Father's Day!" },
  { name: 'Easter', calc: (year) => computeEaster(year), emoji: '🐣', greeting: 'Happy Easter!' },
  { name: 'Halloween', month: 10, day: 31, emoji: '🎃', greeting: 'Happy Halloween!' },
  { name: 'Singles Day', month: 11, day: 11, emoji: '🛍️', greeting: 'Happy Singles Day!' },
  { name: 'Thanksgiving (US)', calc: (year) => nthWeekdayOfMonth(year, 10, 4, 4), emoji: '🦃', greeting: 'Happy Thanksgiving!' },
  { name: 'Black Friday', calc: (year) => addDays(nthWeekdayOfMonth(year, 10, 4, 4), 1), emoji: '🛍️', greeting: 'Happy Black Friday!' },
  { name: 'Christmas', month: 12, day: 25, emoji: '🎄', greeting: 'Merry Christmas!' }
]

export function getHolidayDate(holiday: Holiday, year: number): Date {
  if (holiday.calc) return holiday.calc(year)
  return new Date(year, (holiday.month ?? 1) - 1, holiday.day ?? 1)
}

export function getNextHoliday(now: Date): HolidayResult | null {
  const year = now.getFullYear()
  let closest: HolidayResult | null = null
  
  for (const h of HOLIDAYS) {
    let target = getHolidayDate(h, year)
    if (target < now) {
      target = getHolidayDate(h, year + 1)
    }
    if (!closest || target < closest.date) {
      closest = { ...h, date: target }
    }
  }
  
  return closest
}

export function formatHolidayCountdown(
  now: Date,
  format: 'days' | 'dhm' | 'dh' | 'w' | 'h' | 'm' | 's' | 'date',
  disableIcons: boolean
): string {
  const holiday = getNextHoliday(now)
  if (!holiday) return ''
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(holiday.date.getFullYear(), holiday.date.getMonth(), holiday.date.getDate())
  const isToday = target.getTime() === today.getTime()
  const emoji = disableIcons ? '' : `${holiday.emoji || ''} `
  
  if (isToday) {
    return `${emoji}${holiday.greeting}`.trim()
  }
  
  const diffMs = holiday.date.getTime() - now.getTime()
  const totalMinutes = Math.max(0, Math.floor(diffMs / 60000))
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000))
  const totalHours = Math.max(0, Math.floor(diffMs / 3600000))
  const totalWeeks = Math.max(0, Math.floor(diffMs / 604800000))
  
  switch (format) {
    case 'dhm': {
      const { days, hours, minutes } = formatDhm(diffMs)
      return `${emoji}${days}d ${hours}h ${minutes}m to ${holiday.name}`.trim()
    }
    case 'dh': {
      const { days, hours } = formatDhm(diffMs)
      return `${emoji}${days}d ${hours}h to ${holiday.name}`.trim()
    }
    case 'date': {
      const dateStr = target.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
      return `${emoji}${holiday.name} · ${dateStr}`.trim()
    }
    case 'h':
      return `${emoji}${totalHours}h to ${holiday.name}`.trim()
    case 'm':
      return `${emoji}${totalMinutes} min to ${holiday.name}`.trim()
    case 's':
      return `${emoji}${totalSeconds} sec to ${holiday.name}`.trim()
    case 'w':
      return `${emoji}${totalWeeks} weeks to ${holiday.name}`.trim()
    default: {
      const daysLeft = daysDiff(today, target)
      return `${emoji}${daysLeft} days to ${holiday.name}`.trim()
    }
  }
}
