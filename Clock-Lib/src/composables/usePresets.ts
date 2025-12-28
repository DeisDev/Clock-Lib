import { ref, computed } from 'vue'
import type { Preset, ClockState } from '@/types'

const PRESETS_KEY = 'clocklib_presets'

export function usePresets() {
  const presets = ref<Preset[]>([])
  
  function loadPresets() {
    try {
      const saved = localStorage.getItem(PRESETS_KEY)
      if (saved) {
        presets.value = JSON.parse(saved)
      }
    } catch (e) {
      console.warn('Failed to load presets:', e)
    }
  }
  
  function savePresets() {
    try {
      localStorage.setItem(PRESETS_KEY, JSON.stringify(presets.value))
    } catch (e) {
      console.warn('Failed to save presets:', e)
    }
  }
  
  function createPreset(name: string, state: Partial<ClockState>): Preset {
    const preset: Preset = {
      id: `preset_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      name,
      state: { ...state },
      createdAt: Date.now()
    }
    
    presets.value.push(preset)
    savePresets()
    return preset
  }
  
  function deletePreset(id: string) {
    const index = presets.value.findIndex(p => p.id === id)
    if (index !== -1) {
      presets.value.splice(index, 1)
      savePresets()
    }
  }
  
  function renamePreset(id: string, newName: string) {
    const preset = presets.value.find(p => p.id === id)
    if (preset) {
      preset.name = newName
      savePresets()
    }
  }
  
  function getPreset(id: string): Preset | undefined {
    return presets.value.find(p => p.id === id)
  }
  
  function exportPresets(): string {
    return JSON.stringify(presets.value, null, 2)
  }
  
  function importPresets(json: string): boolean {
    try {
      const imported = JSON.parse(json)
      if (Array.isArray(imported)) {
        for (const preset of imported) {
          if (preset.name && preset.state) {
            createPreset(preset.name, preset.state)
          }
        }
        return true
      }
      return false
    } catch {
      return false
    }
  }
  
  loadPresets()
  
  return {
    presets: computed(() => presets.value),
    createPreset,
    deletePreset,
    renamePreset,
    getPreset,
    exportPresets,
    importPresets
  }
}
