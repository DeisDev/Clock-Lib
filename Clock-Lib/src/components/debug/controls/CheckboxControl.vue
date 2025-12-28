<template>
  <div class="control-row">
    <label class="control-label">{{ label }}</label>
    <input
      type="checkbox"
      class="control-checkbox"
      :checked="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style scoped>
.control-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.control-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
}

.control-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--accent, #5fd3e8);
}
</style>
