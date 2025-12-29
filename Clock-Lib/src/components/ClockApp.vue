<template>
  <div class="clock-app">
    <ClockWidget ref="clockWidgetRef" />
    <AudioVisualizer v-if="audioStore.state.visible" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useClockStore } from '@/stores/clockStore'
import { useAudioVisualizerStore } from '@/stores/audioVisualizerStore'
import ClockWidget from '@/components/ClockWidget.vue'
import AudioVisualizer from '@/components/AudioVisualizer.vue'

const store = useClockStore()
const audioStore = useAudioVisualizerStore()
const clockWidgetRef = ref<InstanceType<typeof ClockWidget> | null>(null)

onMounted(() => {
  store.startTicking(1000)
  
  // Setup Wallpaper Engine general properties listener for FPS limit
  if (typeof window !== 'undefined' && !window.wallpaperPropertyListener) {
    window.wallpaperPropertyListener = {
      applyGeneralProperties: (properties: any) => {
        audioStore.applyGeneralProperties(properties)
      }
    }
  } else if (window.wallpaperPropertyListener && !window.wallpaperPropertyListener.applyGeneralProperties) {
    const original = window.wallpaperPropertyListener
    window.wallpaperPropertyListener = {
      ...original,
      applyGeneralProperties: (properties: any) => {
        audioStore.applyGeneralProperties(properties)
        if (original.applyGeneralProperties) {
          original.applyGeneralProperties(properties)
        }
      }
    }
  }
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
