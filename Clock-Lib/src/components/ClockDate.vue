<template>
  <Transition name="fade">
    <div v-if="dateText" class="clock-date" :style="dateStyles">
      {{ dateText }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useClockStore } from '@/stores/clockStore'

const store = useClockStore()

const dateText = computed(() => store.dateDisplay)

const dateStyles = computed(() => ({
  fontSize: `${store.state.infoFontSize * store.state.infoScale}px`,
  fontFamily: store.infoFontStack,
  fontWeight: String(store.state.infoFontWeight),
  fontStyle: store.state.infoFontStyle,
  textTransform: store.state.infoTextTransform,
  textShadow: store.infoShadow
}))
</script>

<style scoped>
.clock-date {
  margin-top: 6px;
  line-height: 1.3;
  opacity: 0.9;
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
