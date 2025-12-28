<template>
  <div class="control-group">
    <div class="control-header">
      <label class="control-label">{{ label }}</label>
      <span class="control-value">{{ displayValue }}</span>
    </div>
    <div class="slider-row">
      <input
        type="range"
        class="control-slider"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        @input="onSliderChange"
      />
      <input
        type="number"
        class="control-number"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        @input="onNumberChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label: string
  modelValue: number
  min?: number
  max?: number
  step?: number
  precision?: number
  suffix?: string
}>(), {
  min: 0,
  max: 100,
  step: 1,
  precision: 0,
  suffix: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const displayValue = computed(() => {
  const val = props.modelValue.toFixed(props.precision)
  return props.suffix ? `${val}${props.suffix}` : val
})

function onSliderChange(e: Event) {
  emit('update:modelValue', Number((e.target as HTMLInputElement).value))
}

function onNumberChange(e: Event) {
  const value = Number((e.target as HTMLInputElement).value)
  if (!isNaN(value)) {
    emit('update:modelValue', Math.max(props.min, Math.min(props.max, value)))
  }
}
</script>

<style scoped>
.control-group {
  display: grid;
  gap: 8px;
}

.control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.control-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
}

.control-value {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-variant-numeric: tabular-nums;
}

.slider-row {
  display: grid;
  grid-template-columns: 1fr 70px;
  gap: 10px;
  align-items: center;
}

.control-slider {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.control-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: linear-gradient(135deg, var(--accent, #5fd3e8), var(--accent-2, #90ffb0));
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.control-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: linear-gradient(135deg, var(--accent, #5fd3e8), var(--accent-2, #90ffb0));
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.control-number {
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  text-align: center;
}

.control-number:focus {
  outline: none;
  border-color: var(--accent, #5fd3e8);
}

.control-number::-webkit-inner-spin-button,
.control-number::-webkit-outer-spin-button {
  opacity: 0.5;
}
</style>
