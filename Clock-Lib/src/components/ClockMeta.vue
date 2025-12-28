<template>
  <Transition name="fade">
    <div v-if="hasContent" class="clock-meta" :style="metaStyles">
      <div v-if="weekText" class="clock-meta-line">{{ weekText }}</div>
      <div v-if="dayNumberText" class="clock-meta-line">{{ dayNumberText }}</div>
      <div v-if="holidayText" class="clock-meta-line">{{ holidayText }}</div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useClockStore } from '@/stores/clockStore'

const store = useClockStore()

const hasContent = computed(() => store.hasMetaContent)
const weekText = computed(() => store.weekDisplay)
const dayNumberText = computed(() => store.dayNumberDisplay)
const holidayText = computed(() => store.holidayDisplay)

const metaStyles = computed(() => ({
  fontSize: `${store.state.infoFontSize * store.state.infoScale}px`,
  fontFamily: store.infoFontStack,
  fontWeight: String(store.state.infoFontWeight),
  fontStyle: store.state.infoFontStyle,
  textTransform: store.state.infoTextTransform,
  textShadow: store.infoShadow
}))
</script>

<style scoped>
.clock-meta {
  margin-top: 6px;
  display: grid;
  gap: 4px;
  line-height: 1.3;
  opacity: 0.9;
}

.clock-meta-line {
  white-space: nowrap;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
