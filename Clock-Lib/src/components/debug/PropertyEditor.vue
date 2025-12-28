<template>
  <div class="property-editor">
    <div class="editor-search">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search properties..."
        class="search-input"
      />
    </div>
    
    <div class="editor-sections">
      <div
        v-for="group in groupedProperties"
        :key="group.label"
        class="property-section"
      >
        <button
          class="section-header"
          :class="{ collapsed: collapsedSections.has(group.label) }"
          @click="toggleSection(group.label)"
        >
          <span class="section-title">{{ group.label }}</span>
          <span class="section-chevron">▼</span>
        </button>
        
        <Transition name="section">
          <div v-if="!collapsedSections.has(group.label)" class="section-content">
            <template v-for="prop in group.properties" :key="prop.key">
              <CheckboxControl
                v-if="prop.type === 'bool'"
                :label="prop.text || prop.key"
                :model-value="state[prop.key] as boolean"
                @update:model-value="updateValue(prop.key, $event)"
              />
              
              <ColorControl
                v-else-if="prop.type === 'color'"
                :label="prop.text || prop.key"
                :model-value="state[prop.key] as string"
                @update:model-value="updateValue(prop.key, $event)"
              />
              
              <SelectControl
                v-else-if="prop.type === 'combo'"
                :label="prop.text || prop.key"
                :model-value="state[prop.key]"
                :options="prop.options || []"
                @update:model-value="updateValue(prop.key, $event)"
              />
              
              <SliderControl
                v-else-if="prop.type === 'slider'"
                :label="prop.text || prop.key"
                :model-value="state[prop.key] as number"
                :min="prop.min"
                :max="prop.max"
                :step="prop.step"
                :precision="prop.precision"
                @update:model-value="updateValue(prop.key, $event)"
              />
              
              <TextControl
                v-else
                :label="prop.text || prop.key"
                :model-value="String(state[prop.key] ?? '')"
                @update:model-value="updateValue(prop.key, $event)"
              />
            </template>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PropertyDefinition } from '@/types'
import CheckboxControl from './controls/CheckboxControl.vue'
import ColorControl from './controls/ColorControl.vue'
import SelectControl from './controls/SelectControl.vue'
import SliderControl from './controls/SliderControl.vue'
import TextControl from './controls/TextControl.vue'

const props = defineProps<{
  propertyDefs: PropertyDefinition[]
  state: Record<string, any>
}>()

const emit = defineEmits<{
  'update:value': [key: string, value: any]
}>()

const searchQuery = ref('')
const collapsedSections = ref(new Set<string>())
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
    get: (_, key: string) => ({ value: props.state[key] })
  })
  
  return condFn(proxy)
}

const visibleProperties = computed(() => {
  return props.propertyDefs.filter(def => {
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

function toggleSection(label: string) {
  if (collapsedSections.value.has(label)) {
    collapsedSections.value.delete(label)
  } else {
    collapsedSections.value.add(label)
  }
}

function updateValue(key: string, value: any) {
  emit('update:value', key, value)
}
</script>

<style scoped>
.property-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.editor-search {
  padding: 12px 14px;
  border-bottom: 1px solid var(--panel-border, rgba(255, 255, 255, 0.08));
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent, #5fd3e8);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.editor-sections {
  flex: 1;
  overflow-y: auto;
  padding: 8px 14px 14px;
}

.property-section {
  margin-bottom: 4px;
}

.section-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 150ms ease;
}

.section-header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.section-chevron {
  font-size: 10px;
  transition: transform 200ms ease;
}

.section-header.collapsed .section-chevron {
  transform: rotate(-90deg);
}

.section-content {
  padding: 12px;
  display: grid;
  gap: 14px;
}

.section-enter-active,
.section-leave-active {
  transition: all 200ms ease;
  overflow: hidden;
}

.section-enter-from,
.section-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
