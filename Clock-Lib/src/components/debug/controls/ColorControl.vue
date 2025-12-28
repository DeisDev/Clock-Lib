<template>
  <div class="control-group">
    <label class="control-label">{{ label }}</label>
    <div class="color-row">
      <input
        type="color"
        class="control-color"
        :value="hexValue"
        @input="onColorChange"
      />
      <input
        type="text"
        class="control-text"
        :value="hexValue"
        @input="onTextChange"
        maxlength="7"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { rgbStringToHex, hexToRgbString } from '@/utils/colors'

const props = defineProps<{
  label: string
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const hexValue = computed(() => rgbStringToHex(props.modelValue))

function onColorChange(e: Event) {
  const hex = (e.target as HTMLInputElement).value
  emit('update:modelValue', hexToRgbString(hex))
}

function onTextChange(e: Event) {
  const value = (e.target as HTMLInputElement).value
  if (/^#[0-9a-fA-F]{6}$/.test(value)) {
    emit('update:modelValue', hexToRgbString(value))
  }
}
</script>

<style scoped>
.control-group {
  display: grid;
  gap: 6px;
}

.control-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
}

.color-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.control-color {
  width: 40px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  cursor: pointer;
  background: transparent;
  padding: 2px;
}

.control-color::-webkit-color-swatch-wrapper {
  padding: 0;
}

.control-color::-webkit-color-swatch {
  border-radius: 4px;
  border: none;
}

.control-text {
  flex: 1;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
}

.control-text:focus {
  outline: none;
  border-color: var(--accent, #5fd3e8);
}
</style>
