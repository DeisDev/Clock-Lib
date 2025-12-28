<template>
  <div class="clock-app">
    <ClockWidget ref="clockWidgetRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useClockStore } from '@/stores/clockStore'
import ClockWidget from '@/components/ClockWidget.vue'

const store = useClockStore()
const clockWidgetRef = ref<InstanceType<typeof ClockWidget> | null>(null)

onMounted(() => {
  store.startTicking(1000)
})

onUnmounted(() => {
  store.stopTicking()
})

defineExpose({
  setPosition: (x: number, y: number) => {
    clockWidgetRef.value?.setPosition(x, y)
  }
})
</script>

<style scoped>
.clock-app {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.clock-app > * {
  pointer-events: auto;
}
</style>
