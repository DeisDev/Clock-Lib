export interface ClockState {
  visible: boolean
  
  // Time settings
  timeFormat: 12 | 24
  showSeconds: boolean
  separator: string
  blinkSeparator: boolean
  ampmPosition: 'inline' | 'above' | 'below'
  
  // Date settings
  showDate: boolean
  showDay: boolean
  dateFormat: 'words' | 'ymd' | 'mdy' | 'dmy' | 'custom'
  customDateFormat: string
  
  // Meta settings
  showWeek: boolean
  showDayNumber: boolean
  showHoliday: boolean
  holidayFormat: 'days' | 'dhm' | 'dh' | 'w' | 'h' | 'm' | 's' | 'date'
  disableIcons: boolean
  
  // Clock typography
  fontIndex: number
  fontWeight: number
  fontSize: number
  scale: number
  color: string
  letterSpacing: number
  opacity: number
  
  // Clock shadow
  shadow: boolean
  shadowColor: string
  shadowBlur: number
  shadowDistance: number
  shadowAngle: number
  shadowOpacity: number
  
  // Text effects (new)
  textOutline: boolean
  textOutlineColor: string
  textOutlineWidth: number
  textGradient: boolean
  textGradientStart: string
  textGradientEnd: string
  textGradientAngle: number
  
  // Info typography
  infoFontIndex: number
  infoFontStyle: 'normal' | 'italic'
  infoFontWeight: number
  infoFontSize: number
  infoScale: number
  infoTextTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  
  // Info shadow
  infoShadow: boolean
  infoShadowColor: string
  infoShadowBlur: number
  infoShadowDistance: number
  infoShadowAngle: number
  infoShadowOpacity: number
  
  // Background (new)
  showBackground: boolean
  backgroundColor: string
  backgroundOpacity: number
  backgroundBlur: number
  backgroundBorderRadius: number
  backgroundPadding: number
  
  // Position
  posX: number
  posY: number
  dragEnabled: boolean
  
  // Animation (new)
  animateChanges: boolean
  animationDuration: number
}

export interface Holiday {
  name: string
  month?: number
  day?: number
  calc?: (year: number) => Date
  emoji: string
  greeting: string
}

export interface HolidayResult extends Holiday {
  date: Date
}

export interface FontDefinition {
  href?: string
  stack: string
  name?: string
}

export interface PropertyDefinition {
  key: string
  order?: number
  text?: string
  type: 'bool' | 'color' | 'combo' | 'slider' | 'text'
  value?: any
  condition?: string
  min?: number
  max?: number
  step?: number
  precision?: number
  options?: Array<{ label: string; value: any }>
}

export interface WallpaperEngineProperty {
  value: any
}

export interface WallpaperEngineProperties {
  [key: string]: WallpaperEngineProperty
}

export interface ClockPropertyKeys {
  show: string
  timeFormat: string
  showDate: string
  showDay: string
  showSeconds: string
  separator: string
  blinkSeparator: string
  ampmPosition: string
  font: string
  fontWeight: string
  fontSize: string
  scale: string
  color: string
  letterSpacing: string
  opacity: string
  shadow: string
  shadowColor: string
  shadowBlur: string
  shadowDistance: string
  shadowAngle: string
  shadowOpacity: string
  textOutline: string
  textOutlineColor: string
  textOutlineWidth: string
  textGradient: string
  textGradientStart: string
  textGradientEnd: string
  textGradientAngle: string
  infoFont: string
  infoFontStyle: string
  infoFontWeight: string
  infoFontSize: string
  infoScale: string
  infoTextTransform: string
  infoShadow: string
  infoShadowColor: string
  infoShadowBlur: string
  infoShadowDistance: string
  infoShadowAngle: string
  infoShadowOpacity: string
  dateFormat: string
  customDateFormat: string
  showWeek: string
  showDayNumber: string
  showHoliday: string
  holidayFormat: string
  disableIcons: string
  showBackground: string
  backgroundColor: string
  backgroundOpacity: string
  backgroundBlur: string
  backgroundBorderRadius: string
  backgroundPadding: string
  animateChanges: string
  animationDuration: string
  editorVisible: string
}

export interface ClockOptions {
  parent?: HTMLElement
  propertyKeys?: Partial<ClockPropertyKeys>
  storageKey?: string
  tickMs?: number
  initialState?: Partial<ClockState>
}

export interface ClockInstance {
  start: () => void
  dispose: () => void
  applyProperties: (props: WallpaperEngineProperties) => void
  setPosition: (x: number, y: number) => void
  getState: () => ClockState
  applyEditorVisibility: (show: boolean) => void
  toHexColor: (rgb: string) => string
  toRgbString: (hex: string) => string
}

export interface Preset {
  id: string
  name: string
  state: Partial<ClockState>
  createdAt: number
}

export interface DebugLog {
  level: 'log' | 'info' | 'warn' | 'error' | 'debug'
  text: string
  timestamp: Date
}
