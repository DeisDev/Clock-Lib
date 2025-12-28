<template>
  <div
    ref="panelRef"
    class="debug-panel"
    :class="{ 'is-dragging': isDragging }"
  >
    <div class="panel-header" @pointerdown="onHeaderPointerDown">
      <div class="panel-title">Clock Debug</div>
      <div class="panel-stats">
        <span class="stat">FPS: {{ fps.toFixed(1) }}</span>
        <span class="stat">Avg: {{ avgFps.toFixed(1) }}</span>
      </div>
    </div>
    
    <div class="panel-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <div class="panel-content">
      <PropertyEditor
        v-show="activeTab === 'properties'"
        :property-defs="propertyDefs"
        :state="state"
        @update:value="onPropertyUpdate"
      />
      
      <ConsoleViewer v-show="activeTab === 'console'" />
      
      <div v-show="activeTab === 'presets'" class="presets-panel">
        <div class="presets-actions">
          <input
            v-model="newPresetName"
            type="text"
            placeholder="Preset name..."
            class="preset-name-input"
          />
          <button class="preset-btn" @click="savePreset">Save</button>
        </div>
        <div class="presets-list">
          <div
            v-for="preset in presets"
            :key="preset.id"
            class="preset-item"
          >
            <span class="preset-name">{{ preset.name }}</span>
            <div class="preset-actions">
              <button class="preset-action" @click="loadPreset(preset.id)">Load</button>
              <button class="preset-action delete" @click="deletePreset(preset.id)">×</button>
            </div>
          </div>
          <div v-if="presets.length === 0" class="presets-empty">
            No presets saved yet
          </div>
        </div>
      </div>
    </div>
    
    <div class="panel-footer">
      <button class="footer-btn" @click="resetValues">Reset Values</button>
      <button class="footer-btn" @click="exportSettings">Export</button>
      <button class="footer-btn" @click="importSettings">Import</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { PropertyDefinition } from '@/types'
import { usePanelDraggable } from '@/composables/useDraggable'
import { useFps } from '@/composables/useFps'
import { usePresets } from '@/composables/usePresets'
import PropertyEditor from './PropertyEditor.vue'
import ConsoleViewer from './ConsoleViewer.vue'

const props = defineProps<{
  propertyDefs: PropertyDefinition[]
  state: Record<string, any>
  defaultState: Record<string, any>
}>()

const emit = defineEmits<{
  'update:value': [key: string, value: any]
  'reset': []
  'import': [state: Record<string, any>]
}>()

const panelRef = ref<HTMLElement | null>(null)
const activeTab = ref('properties')
const newPresetName = ref('')

const tabs = [
  { id: 'properties', label: 'Properties' },
  { id: 'console', label: 'Console' },
  { id: 'presets', label: 'Presets' }
]

const { fps, avgFps } = useFps()
const { presets, createPreset, deletePreset: removePreset, getPreset } = usePresets()
const { isDragging, onPointerDown: onHeaderPointerDown } = usePanelDraggable(() => panelRef.value)

function onPropertyUpdate(key: string, value: any) {
  emit('update:value', key, value)
}

function resetValues() {
  emit('reset')
}

function savePreset() {
  if (!newPresetName.value.trim()) return
  createPreset(newPresetName.value.trim(), props.state)
  newPresetName.value = ''
}

function loadPreset(id: string) {
  const preset = getPreset(id)
  if (preset) {
    emit('import', preset.state)
  }
}

function deletePreset(id: string) {
  removePreset(id)
}

function exportSettings() {
  const data = JSON.stringify(props.state, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'clock-settings.json'
  a.click()
  URL.revokeObjectURL(url)
}

function importSettings() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      emit('import', data)
    } catch (err) {
      console.error('Failed to import settings:', err)
    }
  }
  input.click()
}
</script>

<style scoped>
.debug-panel {
  position: fixed;
  top: 16px;
  right: 16px;
  width: 420px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 32px);
  background: var(--panel, rgba(12, 16, 28, 0.92));
  border: 1px solid var(--panel-border, rgba(255, 255, 255, 0.08));
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 300;
  resize: both;
  font-family: 'Space Grotesk', 'Segoe UI', system-ui, sans-serif;
  color: var(--text-main, #e7ecf5);
}

.debug-panel.is-dragging {
  user-select: none;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--panel-border, rgba(255, 255, 255, 0.08));
  cursor: move;
  user-select: none;
}

.panel-title {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.panel-stats {
  display: flex;
  gap: 12px;
}

.stat {
  font-size: 11px;
  color: var(--text-dim, #9fb2c7);
  font-variant-numeric: tabular-nums;
}

.panel-tabs {
  display: flex;
  gap: 4px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--panel-border, rgba(255, 255, 255, 0.08));
}

.tab-btn {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--panel-border, rgba(255, 255, 255, 0.08));
  border-radius: 8px;
  background: transparent;
  color: var(--text-dim, #9fb2c7);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-main, #e7ecf5);
}

.tab-btn.active {
  background: linear-gradient(135deg, rgba(95, 211, 232, 0.12), rgba(144, 255, 176, 0.12));
  border-color: rgba(95, 211, 232, 0.2);
  color: var(--text-main, #e7ecf5);
}

.panel-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-footer {
  display: flex;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid var(--panel-border, rgba(255, 255, 255, 0.08));
}

.footer-btn {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--panel-border, rgba(255, 255, 255, 0.08));
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(95, 211, 232, 0.1), rgba(144, 255, 176, 0.1));
  color: var(--text-main, #e7ecf5);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;
}

.footer-btn:hover {
  background: linear-gradient(135deg, rgba(95, 211, 232, 0.2), rgba(144, 255, 176, 0.2));
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.presets-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 14px;
  gap: 12px;
}

.presets-actions {
  display: flex;
  gap: 8px;
}

.preset-name-input {
  flex: 1;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
}

.preset-name-input:focus {
  outline: none;
  border-color: var(--accent, #5fd3e8);
}

.preset-btn {
  padding: 10px 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(95, 211, 232, 0.15), rgba(144, 255, 176, 0.15));
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;
}

.preset-btn:hover {
  background: linear-gradient(135deg, rgba(95, 211, 232, 0.25), rgba(144, 255, 176, 0.25));
}

.presets-list {
  flex: 1;
  overflow-y: auto;
  display: grid;
  gap: 8px;
  align-content: start;
}

.preset-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
}

.preset-name {
  font-size: 13px;
  font-weight: 500;
}

.preset-actions {
  display: flex;
  gap: 6px;
}

.preset-action {
  padding: 4px 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  cursor: pointer;
  transition: all 150ms ease;
}

.preset-action:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.preset-action.delete:hover {
  background: rgba(255, 80, 80, 0.15);
  border-color: rgba(255, 80, 80, 0.3);
  color: #ff6b6b;
}

.presets-empty {
  text-align: center;
  padding: 30px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
}
</style>
