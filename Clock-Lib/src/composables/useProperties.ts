import { ref, computed } from 'vue'
import type { PropertyDefinition, WallpaperEngineProperties } from '@/types'
import { rgbStringToHex, hexToRgbString } from '@/utils/colors'

export function useProperties(
  propertyDefs: PropertyDefinition[],
  initialState: Record<string, any>,
  onUpdate: (state: Record<string, any>) => void
) {
  const state = ref<Record<string, any>>({ ...initialState })
  const searchQuery = ref('')
  
  const conditionCache = new Map<string, (props: Record<string, { value: any }>) => boolean>()
  
  function compileCondition(expr: string | undefined): (props: Record<string, { value: any }>) => boolean {
    if (!expr) return () => true
    if (conditionCache.has(expr)) return conditionCache.get(expr)!
    
    try {
      const fn = new Function('props', `
        try { 
          with (props) { return ${expr}; }
        } catch (e) { 
          return true; 
        }
      `) as (props: Record<string, { value: any }>) => boolean
      conditionCache.set(expr, fn)
      return fn
    } catch {
      return () => true
    }
  }
  
  function checkCondition(def: PropertyDefinition): boolean {
    if (!def.condition) return true
    
    const condFn = compileCondition(def.condition)
    const proxy = new Proxy({} as Record<string, { value: any }>, {
      get: (_, key: string) => ({ value: state.value[key] })
    })
    
    return condFn(proxy)
  }
  
  const visibleProperties = computed(() => {
    return propertyDefs.filter(def => {
      if (def.type === 'text') return true
      if (!checkCondition(def)) return false
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        return (
          def.key.toLowerCase().includes(query) ||
          (def.text?.toLowerCase().includes(query) ?? false)
        )
      }
      return true
    })
  })
  
  const groupedProperties = computed(() => {
    const groups: Array<{ label: string; properties: PropertyDefinition[] }> = []
    let currentGroup: { label: string; properties: PropertyDefinition[] } | null = null
    
    for (const def of visibleProperties.value) {
      if (def.type === 'text') {
        if (currentGroup) groups.push(currentGroup)
        currentGroup = { label: def.text || def.key, properties: [] }
      } else if (currentGroup) {
        currentGroup.properties.push(def)
      } else {
        if (!groups.length) {
          groups.push({ label: 'General', properties: [] })
        }
        groups[0].properties.push(def)
      }
    }
    
    if (currentGroup && currentGroup.properties.length > 0) {
      groups.push(currentGroup)
    }
    
    return groups.filter(g => g.properties.length > 0)
  })
  
  function updateValue(key: string, value: any) {
    state.value[key] = value
    onUpdate(state.value)
  }
  
  function resetToDefaults() {
    for (const def of propertyDefs) {
      if (def.value !== undefined) {
        state.value[def.key] = def.value
      }
    }
    onUpdate(state.value)
  }
  
  function applyWallpaperEngineProperties(props: WallpaperEngineProperties) {
    for (const [key, prop] of Object.entries(props)) {
      if (prop?.value !== undefined && key in state.value) {
        state.value[key] = prop.value
      }
    }
    onUpdate(state.value)
  }
  
  function buildPropsPayload(): WallpaperEngineProperties {
    const payload: WallpaperEngineProperties = {}
    for (const key of Object.keys(state.value)) {
      payload[key] = { value: state.value[key] }
    }
    return payload
  }
  
  function getHexColor(key: string): string {
    return rgbStringToHex(state.value[key] ?? '1 1 1')
  }
  
  function setHexColor(key: string, hex: string) {
    updateValue(key, hexToRgbString(hex))
  }
  
  function exportState(): string {
    return JSON.stringify(state.value, null, 2)
  }
  
  function importState(json: string) {
    try {
      const parsed = JSON.parse(json)
      for (const [key, value] of Object.entries(parsed)) {
        if (key in state.value) {
          state.value[key] = value
        }
      }
      onUpdate(state.value)
      return true
    } catch {
      return false
    }
  }
  
  return {
    state,
    searchQuery,
    visibleProperties,
    groupedProperties,
    updateValue,
    resetToDefaults,
    applyWallpaperEngineProperties,
    buildPropsPayload,
    getHexColor,
    setHexColor,
    checkCondition,
    exportState,
    importState
  }
}
