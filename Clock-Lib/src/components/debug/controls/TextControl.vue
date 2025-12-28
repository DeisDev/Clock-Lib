<template>
  <div class="control-group">
    <label class="control-label">{{ label }}</label>
    <input
      type="text"
      class="control-input"
      :value="modelValue"
      :placeholder="placeholder"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
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

.control-input {
  width: 100%;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  font-size: 13px;
}

.control-input:focus {
  outline: none;
  border-color: var(--accent, #5fd3e8);
}

.control-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
</style>
