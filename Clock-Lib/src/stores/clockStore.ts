import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { ClockState, WallpaperEngineProperties, ClockPropertyKeys } from '@/types'
import { colorToCss, colorToCssWithAlpha, createShadowCss, createGradientCss, clamp01 } from '@/utils/colors'
import { ensureFontLoaded, getFontStack } from '@/utils/fonts'
import { formatTime, formatDateValue, formatHolidayCountdown, getIsoWeek, getDayOfYear } from '@/utils/dates'

export const DEFAULT_STATE: ClockState = {
  visible: true,
  timeFormat: 24,
  showSeconds: false,
  separator: ':',
  blinkSeparator: false,
  ampmPosition: 'inline',
  showDate: true,
  showDay: true,
  dateFormat: 'words',
  customDateFormat: 'MMMM D, YYYY',
  showWeek: false,
  showDayNumber: false,
  showHoliday: false,
  holidayFormat: 'days',
  disableIcons: false,
  fontIndex: 0,
  fontWeight: 500,
  fontSize: 48,
  scale: 1,
  color: '1 1 1',
  letterSpacing: 0,
  opacity: 1,
  shadow: true,
  shadowColor: '0 0 0',
  shadowBlur: 12,
  shadowDistance: 4,
  shadowAngle: 135,
  shadowOpacity: 0.7,
  textOutline: false,
  textOutlineColor: '0 0 0',
  textOutlineWidth: 1,
  textGradient: false,
  textGradientStart: '1 1 1',
  textGradientEnd: '0.7 0.7 1',
  textGradientAngle: 180,
  infoFontIndex: 0,
  infoFontStyle: 'normal',
  infoFontWeight: 500,
  infoFontSize: 16,
  infoScale: 1,
  infoTextTransform: 'none',
  infoShadow: true,
  infoShadowColor: '0 0 0',
  infoShadowBlur: 8,
  infoShadowDistance: 2,
  infoShadowAngle: 135,
  infoShadowOpacity: 0.7,
  showBackground: false,
  backgroundColor: '0 0 0',
  backgroundOpacity: 0.3,
  backgroundBlur: 10,
  backgroundBorderRadius: 16,
  backgroundPadding: 24,
  posX: 0.5,
  posY: 0.5,
  dragEnabled: false,
  animateChanges: true,
  animationDuration: 200
}

export const DEFAULT_PROPERTY_KEYS: ClockPropertyKeys = {
  show: 'showclock',
  timeFormat: 'clocktimeformat',
  showDate: 'clockshowdate',
  showDay: 'clockshowday',
  showSeconds: 'clockshowseconds',
  separator: 'clockseparator',
  blinkSeparator: 'clockblinkseparator',
  ampmPosition: 'clockampmposition',
  font: 'clockfont',
  fontWeight: 'clockfontweight',
  fontSize: 'clockfontsize',
  scale: 'clockscale',
  color: 'clockcolor',
  letterSpacing: 'clockletterspacing',
  opacity: 'clockopacity',
  shadow: 'clockshadow',
  shadowColor: 'clockshadowcolor',
  shadowBlur: 'clockshadowblur',
  shadowDistance: 'clockshadowdistance',
  shadowAngle: 'clockshadowangle',
  shadowOpacity: 'clockshadowopacity',
  textOutline: 'clocktextoutline',
  textOutlineColor: 'clocktextoutlinecolor',
  textOutlineWidth: 'clocktextoutlinewidth',
  textGradient: 'clocktextgradient',
  textGradientStart: 'clocktextgradientstart',
  textGradientEnd: 'clocktextgradientend',
  textGradientAngle: 'clocktextgradientangle',
  infoFont: 'clockinfofont',
  infoFontStyle: 'clockinfofontstyle',
  infoFontWeight: 'clockinfofontweight',
  infoFontSize: 'clockinfofontsize',
  infoScale: 'clockinfoscale',
  infoTextTransform: 'clockinfotexttransform',
  infoShadow: 'clockinfoshadow',
  infoShadowColor: 'clockinfoshadowcolor',
  infoShadowBlur: 'clockinfoshadowblur',
  infoShadowDistance: 'clockinfoshadowdistance',
  infoShadowAngle: 'clockinfoshadowangle',
  infoShadowOpacity: 'clockinfoshadowopacity',
  dateFormat: 'clockdateformat',
  customDateFormat: 'clockcustomdateformat',
  showWeek: 'clockshowweek',
  showDayNumber: 'clockshowdaynumber',
  showHoliday: 'clockshowholiday',
  holidayFormat: 'clockholidayformat',
  disableIcons: 'clockdisableicons',
  showBackground: 'clockshowbackground',
  backgroundColor: 'clockbackgroundcolor',
  backgroundOpacity: 'clockbackgroundopacity',
  backgroundBlur: 'clockbackgroundblur',
  backgroundBorderRadius: 'clockbackgroundborderradius',
  backgroundPadding: 'clockbackgroundpadding',
  animateChanges: 'clockanimatechanges',
  animationDuration: 'clockanimationduration',
  editorVisible: 'showwidgeteditor'
}

export const useClockStore = defineStore('clock', () => {
  const state = ref<ClockState>({ ...DEFAULT_STATE })
  const propertyKeys = ref<ClockPropertyKeys>({ ...DEFAULT_PROPERTY_KEYS })
  const storageKey = ref('clockPosition')
  const editorVisible = ref(false)
  const currentTime = ref(new Date())
  const separatorVisible = ref(true)
  
  let tickInterval: number | null = null
  let blinkInterval: number | null = null
  
  // Computed styles
  const clockFontStack = computed(() => {
    ensureFontLoaded(state.value.fontIndex)
    return getFontStack(state.value.fontIndex)
  })
  
  const infoFontStack = computed(() => {
    ensureFontLoaded(state.value.infoFontIndex)
    return getFontStack(state.value.infoFontIndex)
  })
  
  const clockColor = computed(() => colorToCss(state.value.color))
  
  const clockShadow = computed(() => {
    if (!state.value.shadow) return 'none'
    return createShadowCss(
      state.value.shadowColor,
      state.value.shadowBlur,
      state.value.shadowDistance,
      state.value.shadowAngle,
      state.value.shadowOpacity
    )
  })
  
  const infoShadow = computed(() => {
    if (!state.value.infoShadow) return 'none'
    return createShadowCss(
      state.value.infoShadowColor,
      state.value.infoShadowBlur,
      state.value.infoShadowDistance,
      state.value.infoShadowAngle,
      state.value.infoShadowOpacity
    )
  })
  
  const textGradientStyle = computed(() => {
    if (!state.value.textGradient) return null
    return createGradientCss(
      state.value.textGradientStart,
      state.value.textGradientEnd,
      state.value.textGradientAngle
    )
  })
  
  const textOutlineStyle = computed(() => {
    if (!state.value.textOutline) return 'none'
    const color = colorToCss(state.value.textOutlineColor)
    return `-webkit-text-stroke: ${state.value.textOutlineWidth}px ${color}`
  })
  
  const backgroundStyle = computed(() => {
    if (!state.value.showBackground) return null
    const bgColor = colorToCssWithAlpha(state.value.backgroundColor, state.value.backgroundOpacity)
    return {
      backgroundColor: bgColor,
      backdropFilter: state.value.backgroundBlur > 0 ? `blur(${state.value.backgroundBlur}px)` : 'none',
      borderRadius: `${state.value.backgroundBorderRadius}px`,
      padding: `${state.value.backgroundPadding}px`
    }
  })
  
  // Computed time values
  const timeDisplay = computed(() => {
    const sep = state.value.blinkSeparator && !separatorVisible.value ? ' ' : state.value.separator
    return formatTime(currentTime.value, state.value.timeFormat, state.value.showSeconds, sep)
  })
  
  const dateDisplay = computed(() => {
    if (!state.value.showDate && !state.value.showDay) return ''
    const parts: string[] = []
    if (state.value.showDay) {
      parts.push(currentTime.value.toLocaleDateString(undefined, { weekday: 'long' }))
    }
    if (state.value.showDate) {
      parts.push(formatDateValue(currentTime.value, state.value.dateFormat, state.value.customDateFormat))
    }
    return parts.join(' · ')
  })
  
  const weekDisplay = computed(() => {
    if (!state.value.showWeek) return ''
    const week = getIsoWeek(currentTime.value)
    const dayNum = getDayOfYear(currentTime.value)
    return state.value.showDayNumber ? `Week ${week} · Day ${dayNum}` : `Week ${week}`
  })
  
  const dayNumberDisplay = computed(() => {
    if (!state.value.showDayNumber || state.value.showWeek) return ''
    return `Day ${getDayOfYear(currentTime.value)}`
  })
  
  const holidayDisplay = computed(() => {
    if (!state.value.showHoliday) return ''
    return formatHolidayCountdown(currentTime.value, state.value.holidayFormat, state.value.disableIcons)
  })
  
  const hasMetaContent = computed(() => {
    return state.value.showWeek || state.value.showDayNumber || state.value.showHoliday
  })
  
  // Actions
  function updateState(partial: Partial<ClockState>) {
    state.value = { ...state.value, ...partial }
  }
  
  function setPosition(x: number, y: number) {
    state.value.posX = clamp01(x)
    state.value.posY = clamp01(y)
    savePosition()
  }
  
  function savePosition() {
    try {
      localStorage.setItem(storageKey.value, JSON.stringify({
        posX: state.value.posX,
        posY: state.value.posY,
        dragEnabled: state.value.dragEnabled
      }))
    } catch (e) {
      console.warn('Failed to save clock position:', e)
    }
  }
  
  function loadPosition() {
    try {
      const saved = localStorage.getItem(storageKey.value)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.posX !== undefined) state.value.posX = parsed.posX
        if (parsed.posY !== undefined) state.value.posY = parsed.posY
        if (parsed.dragEnabled !== undefined) state.value.dragEnabled = parsed.dragEnabled
      }
    } catch (e) {
      console.warn('Failed to load clock position:', e)
    }
  }
  
  function applyProperties(props: WallpaperEngineProperties) {
    const keys = propertyKeys.value
    
    if (props[keys.show] !== undefined) state.value.visible = !!props[keys.show].value
    if (props[keys.timeFormat] !== undefined) state.value.timeFormat = Number(props[keys.timeFormat].value) as 12 | 24
    if (props[keys.showDate] !== undefined) state.value.showDate = !!props[keys.showDate].value
    if (props[keys.showDay] !== undefined) state.value.showDay = !!props[keys.showDay].value
    if (props[keys.showSeconds] !== undefined) state.value.showSeconds = !!props[keys.showSeconds].value
    if (props[keys.separator] !== undefined) state.value.separator = String(props[keys.separator].value)
    if (props[keys.blinkSeparator] !== undefined) state.value.blinkSeparator = !!props[keys.blinkSeparator].value
    if (props[keys.ampmPosition] !== undefined) state.value.ampmPosition = props[keys.ampmPosition].value
    if (props[keys.font] !== undefined) state.value.fontIndex = Number(props[keys.font].value)
    if (props[keys.fontWeight] !== undefined) state.value.fontWeight = Number(props[keys.fontWeight].value)
    if (props[keys.fontSize] !== undefined) state.value.fontSize = Number(props[keys.fontSize].value)
    if (props[keys.scale] !== undefined) state.value.scale = Number(props[keys.scale].value)
    if (props[keys.color] !== undefined) state.value.color = props[keys.color].value
    if (props[keys.letterSpacing] !== undefined) state.value.letterSpacing = Number(props[keys.letterSpacing].value)
    if (props[keys.opacity] !== undefined) state.value.opacity = Number(props[keys.opacity].value)
    if (props[keys.shadow] !== undefined) state.value.shadow = !!props[keys.shadow].value
    if (props[keys.shadowColor] !== undefined) state.value.shadowColor = props[keys.shadowColor].value
    if (props[keys.shadowBlur] !== undefined) state.value.shadowBlur = Number(props[keys.shadowBlur].value)
    if (props[keys.shadowDistance] !== undefined) state.value.shadowDistance = Number(props[keys.shadowDistance].value)
    if (props[keys.shadowAngle] !== undefined) state.value.shadowAngle = Number(props[keys.shadowAngle].value)
    if (props[keys.shadowOpacity] !== undefined) state.value.shadowOpacity = Number(props[keys.shadowOpacity].value)
    if (props[keys.textOutline] !== undefined) state.value.textOutline = !!props[keys.textOutline].value
    if (props[keys.textOutlineColor] !== undefined) state.value.textOutlineColor = props[keys.textOutlineColor].value
    if (props[keys.textOutlineWidth] !== undefined) state.value.textOutlineWidth = Number(props[keys.textOutlineWidth].value)
    if (props[keys.textGradient] !== undefined) state.value.textGradient = !!props[keys.textGradient].value
    if (props[keys.textGradientStart] !== undefined) state.value.textGradientStart = props[keys.textGradientStart].value
    if (props[keys.textGradientEnd] !== undefined) state.value.textGradientEnd = props[keys.textGradientEnd].value
    if (props[keys.textGradientAngle] !== undefined) state.value.textGradientAngle = Number(props[keys.textGradientAngle].value)
    if (props[keys.infoFont] !== undefined) state.value.infoFontIndex = Number(props[keys.infoFont].value)
    if (props[keys.infoFontStyle] !== undefined) state.value.infoFontStyle = props[keys.infoFontStyle].value
    if (props[keys.infoFontWeight] !== undefined) state.value.infoFontWeight = Number(props[keys.infoFontWeight].value)
    if (props[keys.infoFontSize] !== undefined) state.value.infoFontSize = Number(props[keys.infoFontSize].value)
    if (props[keys.infoScale] !== undefined) state.value.infoScale = Number(props[keys.infoScale].value)
    if (props[keys.infoTextTransform] !== undefined) state.value.infoTextTransform = props[keys.infoTextTransform].value
    if (props[keys.infoShadow] !== undefined) state.value.infoShadow = !!props[keys.infoShadow].value
    if (props[keys.infoShadowColor] !== undefined) state.value.infoShadowColor = props[keys.infoShadowColor].value
    if (props[keys.infoShadowBlur] !== undefined) state.value.infoShadowBlur = Number(props[keys.infoShadowBlur].value)
    if (props[keys.infoShadowDistance] !== undefined) state.value.infoShadowDistance = Number(props[keys.infoShadowDistance].value)
    if (props[keys.infoShadowAngle] !== undefined) state.value.infoShadowAngle = Number(props[keys.infoShadowAngle].value)
    if (props[keys.infoShadowOpacity] !== undefined) state.value.infoShadowOpacity = Number(props[keys.infoShadowOpacity].value)
    if (props[keys.dateFormat] !== undefined) state.value.dateFormat = props[keys.dateFormat].value
    if (props[keys.customDateFormat] !== undefined) state.value.customDateFormat = props[keys.customDateFormat].value
    if (props[keys.showWeek] !== undefined) state.value.showWeek = !!props[keys.showWeek].value
    if (props[keys.showDayNumber] !== undefined) state.value.showDayNumber = !!props[keys.showDayNumber].value
    if (props[keys.showHoliday] !== undefined) state.value.showHoliday = !!props[keys.showHoliday].value
    if (props[keys.holidayFormat] !== undefined) state.value.holidayFormat = props[keys.holidayFormat].value
    if (props[keys.disableIcons] !== undefined) state.value.disableIcons = !!props[keys.disableIcons].value
    if (props[keys.showBackground] !== undefined) state.value.showBackground = !!props[keys.showBackground].value
    if (props[keys.backgroundColor] !== undefined) state.value.backgroundColor = props[keys.backgroundColor].value
    if (props[keys.backgroundOpacity] !== undefined) state.value.backgroundOpacity = Number(props[keys.backgroundOpacity].value)
    if (props[keys.backgroundBlur] !== undefined) state.value.backgroundBlur = Number(props[keys.backgroundBlur].value)
    if (props[keys.backgroundBorderRadius] !== undefined) state.value.backgroundBorderRadius = Number(props[keys.backgroundBorderRadius].value)
    if (props[keys.backgroundPadding] !== undefined) state.value.backgroundPadding = Number(props[keys.backgroundPadding].value)
    if (props[keys.animateChanges] !== undefined) state.value.animateChanges = !!props[keys.animateChanges].value
    if (props[keys.animationDuration] !== undefined) state.value.animationDuration = Number(props[keys.animationDuration].value)
    if (props[keys.editorVisible] !== undefined) editorVisible.value = !!props[keys.editorVisible].value
  }
  
  function startTicking(intervalMs = 1000) {
    if (tickInterval) clearInterval(tickInterval)
    
    currentTime.value = new Date()
    tickInterval = window.setInterval(() => {
      currentTime.value = new Date()
    }, intervalMs)
    
    // Handle blinking separator
    watch(() => state.value.blinkSeparator, (blink) => {
      if (blinkInterval) {
        clearInterval(blinkInterval)
        blinkInterval = null
      }
      if (blink) {
        blinkInterval = window.setInterval(() => {
          separatorVisible.value = !separatorVisible.value
        }, 500)
      } else {
        separatorVisible.value = true
      }
    }, { immediate: true })
  }
  
  function stopTicking() {
    if (tickInterval) {
      clearInterval(tickInterval)
      tickInterval = null
    }
    if (blinkInterval) {
      clearInterval(blinkInterval)
      blinkInterval = null
    }
  }
  
  function getState(): ClockState {
    return { ...state.value }
  }
  
  function configure(options: { storageKey?: string; propertyKeys?: Partial<ClockPropertyKeys>; initialState?: Partial<ClockState> }) {
    if (options.storageKey) storageKey.value = options.storageKey
    if (options.propertyKeys) propertyKeys.value = { ...DEFAULT_PROPERTY_KEYS, ...options.propertyKeys }
    if (options.initialState) state.value = { ...DEFAULT_STATE, ...options.initialState }
  }
  
  return {
    state,
    propertyKeys,
    editorVisible,
    currentTime,
    separatorVisible,
    clockFontStack,
    infoFontStack,
    clockColor,
    clockShadow,
    infoShadow,
    textGradientStyle,
    textOutlineStyle,
    backgroundStyle,
    timeDisplay,
    dateDisplay,
    weekDisplay,
    dayNumberDisplay,
    holidayDisplay,
    hasMetaContent,
    updateState,
    setPosition,
    savePosition,
    loadPosition,
    applyProperties,
    startTicking,
    stopTicking,
    getState,
    configure
  }
})
