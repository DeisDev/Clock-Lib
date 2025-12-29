<template>
  <Transition name="visualizer-fade">
    <div
      v-if="store.state.visible"
      ref="containerRef"
      class="audio-visualizer-container"
      :style="containerStyles"
      aria-label="Audio Visualizer"
    >
      <div class="visualizer-content" :style="visualizerStyles">
        <component :is="currentVisualizer" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, markRaw } from 'vue'
import { useAudioVisualizerStore } from '@/stores/audioVisualizerStore'
import BarVisualizer from './visualizers/BarVisualizer.vue'
import WaveVisualizer from './visualizers/WaveVisualizer.vue'
import CircleVisualizer from './visualizers/CircleVisualizer.vue'
import ParticleVisualizer from './visualizers/ParticleVisualizer.vue'

const store = useAudioVisualizerStore()

const currentVisualizer = computed(() => {
  const visualizers = {
    bar: markRaw(BarVisualizer),
    wave: markRaw(WaveVisualizer),
    circle: markRaw(CircleVisualizer),
    particle: markRaw(ParticleVisualizer)
  }
  return visualizers[store.state.visualizerType] || visualizers.bar
})

const containerStyles = computed(() => {
  const alignment = store.state.alignment
  let left = `${store.state.posX * 100}%`
  let top = `${store.state.posY * 100}%`
  let transform = 'translate(-50%, -50%)'
  
  // Adjust transform based on alignment
  switch (alignment) {
    case 'top':
      transform = 'translate(-50%, 0%)'
      break
    case 'bottom':
      transform = 'translate(-50%, -100%)'
      break
    case 'left':
      transform = 'translate(0%, -50%)'
      break
    case 'right':
      transform = 'translate(-100%, -50%)'
      break
    case 'center':
    default:
      transform = 'translate(-50%, -50%)'
  }
  
  transform += ` scale(${store.state.scale}) rotate(${store.state.rotation}deg)`
  
  return {
    left,
    top,
    transform,
    opacity: store.state.opacity,
    '--animation-duration': store.state.animateChanges ? `${store.state.animationDuration}ms` : '0ms'
  }
})

const visualizerStyles = computed(() => {
  const styles: Record<string, string> = {}
  
  if (store.state.shadow && store.visualizerShadow) {
    styles.filter = `drop-shadow(${store.visualizerShadow})`
  }
  
  if (store.state.glow && store.glowStyle) {
    const currentFilter = styles.filter || ''
    styles.filter = currentFilter ? `${currentFilter} drop-shadow(${store.glowStyle})` : `drop-shadow(${store.glowStyle})`
  }
  
  return styles
})
</script>

<style scoped>
.audio-visualizer-container {
  position: absolute;
  pointer-events: none;
  user-select: none;
  z-index: 2;
}

.visualizer-content {
  position: relative;
}

.visualizer-fade-enter-active,
.visualizer-fade-leave-active {
  transition: opacity var(--animation-duration, 200ms) ease,
              transform var(--animation-duration, 200ms) ease;
}

.visualizer-fade-enter-from,
.visualizer-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}
</style>
