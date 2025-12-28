<template>
  <div class="control-group">
    <label class="control-label">{{ label }}</label>
    <select
      class="control-select"
      :value="modelValue"
      @change="emit('update:modelValue', getTypedValue(($event.target as HTMLSelectElement).value))"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  modelValue: string | number
  options: Array<{ label: string; value: string | number }>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

function getTypedValue(value: string): string | number {
  if (typeof props.modelValue === 'number') {
    return Number(value)
  }
  return value
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

.control-select {
  width: 100%;
  padding: 8px 10px;
  background: rgba(20, 20, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
}

.control-select:focus {
  outline: none;
  border-color: var(--accent, #5fd3e8);
}

.control-select option {
  background: rgba(20, 20, 30, 1);
  color: #fff;
  padding: 8px;
}
</style>
