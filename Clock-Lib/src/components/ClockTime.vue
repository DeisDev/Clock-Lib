<template>
  <div 
    class="clock-time"
    :class="{ 'has-gradient': hasGradient }"
    :style="timeStyles"
  >
    <span v-if="ampmPosition === 'above' && ampm" class="clock-ampm clock-ampm-above">
      {{ ampm }}
    </span>
    <span class="clock-time-wrap">
      <span class="clock-time-main">{{ time }}</span>
      <span v-if="ampmPosition === 'inline' && ampm" class="clock-ampm clock-ampm-inline">
        {{ ampm }}
      </span>
    </span>
    <span v-if="ampmPosition === 'below' && ampm" class="clock-ampm clock-ampm-below">
      {{ ampm }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useClockStore } from '@/stores/clockStore'

const store = useClockStore()

const time = computed(() => store.timeDisplay.main)
const ampm = computed(() => store.timeDisplay.suffix)
const ampmPosition = computed(() => store.state.ampmPosition)
const hasGradient = computed(() => store.state.textGradient)

const timeStyles = computed(() => {
  const styles: Record<string, string> = {
    fontSize: `${store.state.fontSize}px`,
    fontWeight: String(store.state.fontWeight),
    letterSpacing: `${store.state.letterSpacing}px`,
    textShadow: store.clockShadow
  }
  
  if (store.state.textGradient && store.textGradientStyle) {
    styles.background = store.textGradientStyle
    styles.backgroundClip = 'text'
    styles.webkitBackgroundClip = 'text'
    styles.color = 'transparent'
  }
  
  if (store.state.textOutline) {
    styles.webkitTextStroke = `${store.state.textOutlineWidth}px ${store.clockColor}`
  }
  
  return styles
})
</script>

<style scoped>
.clock-time {
  line-height: 1.1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.clock-time-wrap {
  position: relative;
  display: inline-flex;
  align-items: baseline;
}

.clock-time-main {
  font-variant-numeric: tabular-nums;
}

.clock-ampm {
  font-size: 0.35em;
  font-weight: inherit;
  white-space: nowrap;
  opacity: 0.9;
}

.clock-ampm-inline {
  position: absolute;
  left: 100%;
  bottom: 0.15em;
  margin-left: 0.2em;
}

.clock-ampm-above,
.clock-ampm-below {
  font-size: 0.4em;
  letter-spacing: 0.1em;
}

.clock-ampm-above {
  margin-bottom: 0.2em;
}

.clock-ampm-below {
  margin-top: 0.2em;
}

.has-gradient {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>
