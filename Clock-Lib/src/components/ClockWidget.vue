<template>
  <Transition name="clock-fade">
    <div
      v-if="store.state.visible"
      ref="containerRef"
      class="clock-container"
      :class="{
        'drag-enabled': store.state.dragEnabled,
        'dragging': isDragging,
        'has-background': store.state.showBackground
      }"
      :style="containerStyles"
      @pointerdown="onPointerDown"
      aria-live="polite"
    >
      <div v-if="store.state.showBackground" class="clock-background" :style="backgroundStyles" />
      <div class="clock-content">
        <ClockTime />
        <ClockDate />
        <ClockMeta />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useClockStore } from '@/stores/clockStore'
import { useDraggable } from '@/composables/useDraggable'
import ClockTime from './ClockTime.vue'
import ClockDate from './ClockDate.vue'
import ClockMeta from './ClockMeta.vue'

const store = useClockStore()
const containerRef = ref<HTMLElement | null>(null)

const { posX, posY, isDragging, onPointerDown, setPosition } = useDraggable({
  initialX: store.state.posX,
  initialY: store.state.posY,
  enabled: () => store.state.dragEnabled,
  onMove: (x, y) => {
    store.setPosition(x, y)
  },
  onEnd: () => {
    store.savePosition()
  }
})

const containerStyles = computed(() => ({
  left: `${store.state.posX * 100}%`,
  top: `${store.state.posY * 100}%`,
  transform: `translate(-50%, -50%) scale(${store.state.scale})`,
  color: store.clockColor,
  fontFamily: store.clockFontStack,
  opacity: store.state.opacity,
  '--animation-duration': store.state.animateChanges ? `${store.state.animationDuration}ms` : '0ms'
}))

const backgroundStyles = computed(() => {
  if (!store.backgroundStyle) return {}
  return store.backgroundStyle
})

onMounted(() => {
  store.loadPosition()
  setPosition(store.state.posX, store.state.posY)
})

defineExpose({
  setPosition: (x: number, y: number) => {
    setPosition(x, y)
    store.setPosition(x, y)
  }
})
</script>

<style scoped>
.clock-container {
  position: absolute;
  text-align: center;
  pointer-events: none;
  user-select: none;
  z-index: 1;
}

.clock-container.drag-enabled {
  pointer-events: auto;
  cursor: grab;
}

.clock-container.dragging {
  cursor: grabbing;
}

.clock-content {
  position: relative;
  z-index: 1;
}

.clock-background {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.has-background .clock-content {
  position: relative;
}

.clock-fade-enter-active,
.clock-fade-leave-active {
  transition: opacity var(--animation-duration, 200ms) ease,
              transform var(--animation-duration, 200ms) ease;
}

.clock-fade-enter-from,
.clock-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.95);
}
</style>
