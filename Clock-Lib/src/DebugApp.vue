<template>
  <div class="debug-app">
    <div id="wallpaper-root" ref="wallpaperRoot">
      <ClockWidget />
      <AudioVisualizer v-if="audioStore.state.visible" />
    </div>
    <DebugPanel
      :property-defs="propertyDefs"
      :state="state"
      :default-state="defaultState"
      @update:value="onPropertyUpdate"
      @reset="onReset"
      @import="onImport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { PropertyDefinition, WallpaperEngineProperties } from '@/types'
import { useClockStore, DEFAULT_STATE } from '@/stores/clockStore'
import { useAudioVisualizerStore } from '@/stores/audioVisualizerStore'
import DebugPanel from '@/components/debug/DebugPanel.vue'
import ClockWidget from '@/components/ClockWidget.vue'
import AudioVisualizer from '@/components/AudioVisualizer.vue'

const wallpaperRoot = ref<HTMLElement | null>(null)
const propertyDefs = ref<PropertyDefinition[]>([])
const state = reactive<Record<string, any>>({})
const defaultState = reactive<Record<string, any>>({})

const store = useClockStore()
const audioStore = useAudioVisualizerStore()

async function loadProperties() {
  try {
    const res = await fetch('./clock-properties.json', { cache: 'no-cache' })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json()
    
    propertyDefs.value = Object.entries(json.properties || {})
      .map(([key, def]: [string, any]) => ({ key, ...def }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    
    propertyDefs.value.forEach((def) => {
      if (def.value !== undefined) {
        state[def.key] = def.value
        defaultState[def.key] = def.value
      }
    })
    
    applyStateToStore()
  } catch (err) {
    console.error('Failed to load properties:', err)
  }
}

function buildPropsPayload(): WallpaperEngineProperties {
  const payload: WallpaperEngineProperties = {}
  Object.keys(state).forEach((k) => {
    payload[k] = { value: state[k] }
  })
  return payload
}

function applyStateToStore() {
  const payload = buildPropsPayload()
  store.applyProperties(payload)
  audioStore.applyProperties(payload)
}

function onPropertyUpdate(key: string, value: any) {
  state[key] = value
  applyStateToStore()
}

function onReset() {
  Object.keys(defaultState).forEach((key) => {
    state[key] = defaultState[key]
  })
  applyStateToStore()
}

function onImport(importedState: Record<string, any>) {
  Object.keys(importedState).forEach((key) => {
    if (key in state) {
      state[key] = importedState[key]
    }
  })
  applyStateToStore()
}

onMounted(async () => {
  await loadProperties()
  store.startTicking(1000)
})
</script>

<style>
:root {
  --bg-1: #0b1224;
  --bg-2: #0f1f35;
  --bg-3: #142a3f;
  --panel: rgba(12, 16, 28, 0.92);
  --panel-border: rgba(255, 255, 255, 0.08);
  --text-main: #e7ecf5;
  --text-dim: #9fb2c7;
  --accent: #5fd3e8;
  --accent-2: #90ffb0;
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  font-family: 'Space Grotesk', 'Segoe UI', system-ui, sans-serif;
  color: var(--text-main);
  background: radial-gradient(circle at 20% 20%, rgba(144, 255, 176, 0.12), transparent 40%),
              radial-gradient(circle at 80% 30%, rgba(95, 211, 232, 0.18), transparent 38%),
              radial-gradient(circle at 50% 80%, rgba(255, 255, 255, 0.06), transparent 42%),
              linear-gradient(135deg, var(--bg-1), var(--bg-2) 45%, var(--bg-3));
}

.debug-app {
  position: fixed;
  inset: 0;
}

#wallpaper-root {
  position: fixed;
  inset: 0;
}
</style>
