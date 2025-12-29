import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AudioVisualizerState, WallpaperEngineProperties, AudioVisualizerPropertyKeys } from '@/types'
import { colorToCss, createShadowCss, createGradientCss } from '@/utils/colors'

export const DEFAULT_AUDIO_STATE: AudioVisualizerState = {
  visible: false,
  visualizerType: 'bar',
  smoothing: 0.8,
  sensitivity: 1.0,
  minFrequency: 0,
  maxFrequency: 64,
  barCount: 64,
  barWidth: 4,
  barGap: 2,
  barRadius: 2,
  color: '1 1 1',
  gradientEnabled: false,
  gradientStart: '1 0.2 0.6',
  gradientEnd: '0.2 0.6 1',
  gradientAngle: 180,
  rainbow: false,
  mirror: false,
  stereo: false,
  peakHold: false,
  decayRate: 0.95,
  posX: 0.5,
  posY: 0.9,
  width: 800,
  height: 200,
  scale: 1,
  rotation: 0,
  alignment: 'center',
  glow: false,
  glowColor: '1 1 1',
  glowIntensity: 10,
  shadow: false,
  shadowColor: '0 0 0',
  shadowBlur: 10,
  shadowDistance: 5,
  shadowAngle: 135,
  shadowOpacity: 0.7,
  opacity: 1,
  animateChanges: true,
  animationDuration: 200
}

export const DEFAULT_AUDIO_PROPERTY_KEYS: AudioVisualizerPropertyKeys = {
  show: 'audiovisualizershow',
  visualizerType: 'audiovisualizertype',
  smoothing: 'audiovisualizersmoothing',
  sensitivity: 'audiovisualizersensitivity',
  minFrequency: 'audiovisualizerminfrequency',
  maxFrequency: 'audiovisualizermaxfrequency',
  barCount: 'audiovisualizerbarcount',
  barWidth: 'audiovisualizerbarwidth',
  barGap: 'audiovisualizerbargap',
  barRadius: 'audiovisualizerbarradius',
  color: 'audiovisualizercolor',
  gradientEnabled: 'audiovisualizergradientenabled',
  gradientStart: 'audiovisualizergradientstart',
  gradientEnd: 'audiovisualizergradientend',
  gradientAngle: 'audiovisualizergradientangle',
  rainbow: 'audiovisualizerrainbow',
  mirror: 'audiovisualizermirror',
  stereo: 'audiovisualizerstereo',
  peakHold: 'audiovisualizerpeakhold',
  decayRate: 'audiovisualizerdecayrate',
  posX: 'audiovisualizerposx',
  posY: 'audiovisualizerposy',
  width: 'audiovisualizerwidth',
  height: 'audiovisualizerheight',
  scale: 'audiovisualizerscale',
  rotation: 'audiovisualizerrotation',
  alignment: 'audiovisualizeralignment',
  glow: 'audiovisualizerglow',
  glowColor: 'audiovisualizerglowcolor',
  glowIntensity: 'audiovisualizerglowintensity',
  shadow: 'audiovisualizershadow',
  shadowColor: 'audiovisualizershadowcolor',
  shadowBlur: 'audiovisualizershadowblur',
  shadowDistance: 'audiovisualizershadowdistance',
  shadowAngle: 'audiovisualizershadowangle',
  shadowOpacity: 'audiovisualizershadowopacity',
  opacity: 'audiovisualizeropacity',
  animateChanges: 'audiovisualizeranimatechanges',
  animationDuration: 'audiovisualizeranimationduration'
}

export const useAudioVisualizerStore = defineStore('audioVisualizer', () => {
  const state = ref<AudioVisualizerState>({ ...DEFAULT_AUDIO_STATE })
  const propertyKeys = ref<AudioVisualizerPropertyKeys>({ ...DEFAULT_AUDIO_PROPERTY_KEYS })
  const fpsLimit = ref<number>(0)
  
  // Computed styles
  const visualizerColor = computed(() => colorToCss(state.value.color))
  
  const visualizerGradient = computed(() => {
    if (!state.value.gradientEnabled) return null
    return createGradientCss(
      state.value.gradientStart,
      state.value.gradientEnd,
      state.value.gradientAngle
    )
  })
  
  const visualizerShadow = computed(() => {
    if (!state.value.shadow) return null
    return createShadowCss(
      state.value.shadowColor,
      state.value.shadowBlur,
      state.value.shadowDistance,
      state.value.shadowAngle,
      state.value.shadowOpacity
    )
  })
  
  const glowStyle = computed(() => {
    if (!state.value.glow) return null
    const color = colorToCss(state.value.glowColor)
    const intensity = state.value.glowIntensity
    return `0 0 ${intensity}px ${color}, 0 0 ${intensity * 2}px ${color}`
  })
  
  function updateState(updates: Partial<AudioVisualizerState>) {
    Object.assign(state.value, updates)
  }
  
  function setPosition(x: number, y: number) {
    state.value.posX = Math.max(0, Math.min(1, x))
    state.value.posY = Math.max(0, Math.min(1, y))
  }
  
  function applyProperties(props: WallpaperEngineProperties) {
    const keys = propertyKeys.value
    
    if (props[keys.show] !== undefined) state.value.visible = !!props[keys.show].value
    if (props[keys.visualizerType] !== undefined) state.value.visualizerType = props[keys.visualizerType].value
    if (props[keys.smoothing] !== undefined) state.value.smoothing = Number(props[keys.smoothing].value)
    if (props[keys.sensitivity] !== undefined) state.value.sensitivity = Number(props[keys.sensitivity].value)
    if (props[keys.minFrequency] !== undefined) state.value.minFrequency = Number(props[keys.minFrequency].value)
    if (props[keys.maxFrequency] !== undefined) state.value.maxFrequency = Number(props[keys.maxFrequency].value)
    if (props[keys.barCount] !== undefined) state.value.barCount = Number(props[keys.barCount].value)
    if (props[keys.barWidth] !== undefined) state.value.barWidth = Number(props[keys.barWidth].value)
    if (props[keys.barGap] !== undefined) state.value.barGap = Number(props[keys.barGap].value)
    if (props[keys.barRadius] !== undefined) state.value.barRadius = Number(props[keys.barRadius].value)
    if (props[keys.color] !== undefined) state.value.color = props[keys.color].value
    if (props[keys.gradientEnabled] !== undefined) state.value.gradientEnabled = !!props[keys.gradientEnabled].value
    if (props[keys.gradientStart] !== undefined) state.value.gradientStart = props[keys.gradientStart].value
    if (props[keys.gradientEnd] !== undefined) state.value.gradientEnd = props[keys.gradientEnd].value
    if (props[keys.gradientAngle] !== undefined) state.value.gradientAngle = Number(props[keys.gradientAngle].value)
    if (props[keys.rainbow] !== undefined) state.value.rainbow = !!props[keys.rainbow].value
    if (props[keys.mirror] !== undefined) state.value.mirror = !!props[keys.mirror].value
    if (props[keys.stereo] !== undefined) state.value.stereo = !!props[keys.stereo].value
    if (props[keys.peakHold] !== undefined) state.value.peakHold = !!props[keys.peakHold].value
    if (props[keys.decayRate] !== undefined) state.value.decayRate = Number(props[keys.decayRate].value)
    if (props[keys.posX] !== undefined) state.value.posX = Number(props[keys.posX].value)
    if (props[keys.posY] !== undefined) state.value.posY = Number(props[keys.posY].value)
    if (props[keys.width] !== undefined) state.value.width = Number(props[keys.width].value)
    if (props[keys.height] !== undefined) state.value.height = Number(props[keys.height].value)
    if (props[keys.scale] !== undefined) state.value.scale = Number(props[keys.scale].value)
    if (props[keys.rotation] !== undefined) state.value.rotation = Number(props[keys.rotation].value)
    if (props[keys.alignment] !== undefined) state.value.alignment = props[keys.alignment].value
    if (props[keys.glow] !== undefined) state.value.glow = !!props[keys.glow].value
    if (props[keys.glowColor] !== undefined) state.value.glowColor = props[keys.glowColor].value
    if (props[keys.glowIntensity] !== undefined) state.value.glowIntensity = Number(props[keys.glowIntensity].value)
    if (props[keys.shadow] !== undefined) state.value.shadow = !!props[keys.shadow].value
    if (props[keys.shadowColor] !== undefined) state.value.shadowColor = props[keys.shadowColor].value
    if (props[keys.shadowBlur] !== undefined) state.value.shadowBlur = Number(props[keys.shadowBlur].value)
    if (props[keys.shadowDistance] !== undefined) state.value.shadowDistance = Number(props[keys.shadowDistance].value)
    if (props[keys.shadowAngle] !== undefined) state.value.shadowAngle = Number(props[keys.shadowAngle].value)
    if (props[keys.shadowOpacity] !== undefined) state.value.shadowOpacity = Number(props[keys.shadowOpacity].value)
    if (props[keys.opacity] !== undefined) state.value.opacity = Number(props[keys.opacity].value)
    if (props[keys.animateChanges] !== undefined) state.value.animateChanges = !!props[keys.animateChanges].value
    if (props[keys.animationDuration] !== undefined) state.value.animationDuration = Number(props[keys.animationDuration].value)
  }
  
  function applyGeneralProperties(props: { fps?: number }) {
    if (props.fps !== undefined) {
      fpsLimit.value = props.fps
    }
  }
  
  function getState(): AudioVisualizerState {
    return { ...state.value }
  }
  
  function configure(options: { propertyKeys?: Partial<AudioVisualizerPropertyKeys>; initialState?: Partial<AudioVisualizerState> }) {
    if (options.propertyKeys) {
      Object.assign(propertyKeys.value, options.propertyKeys)
    }
    if (options.initialState) {
      Object.assign(state.value, options.initialState)
    }
  }
  
  return {
    state,
    propertyKeys,
    fpsLimit,
    visualizerColor,
    visualizerGradient,
    visualizerShadow,
    glowStyle,
    updateState,
    setPosition,
    applyProperties,
    applyGeneralProperties,
    getState,
    configure
  }
})
