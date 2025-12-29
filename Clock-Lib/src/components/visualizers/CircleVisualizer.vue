<template>
  <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAudioVisualizerStore } from '@/stores/audioVisualizerStore'
import { useAudioVisualizer } from '@/composables/useAudioVisualizer'

const store = useAudioVisualizerStore()
const { getBarData, getRainbowColor } = useAudioVisualizer()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationFrameId: number | null = null
let lastFrameTime = 0
let fpsThreshold = 0

const canvasWidth = computed(() => store.state.width)
const canvasHeight = computed(() => store.state.height)

onMounted(() => {
  if (!canvasRef.value) return
  
  ctx = canvasRef.value.getContext('2d')
  if (ctx) {
    startRendering()
  }
})

onUnmounted(() => {
  stopRendering()
})

function startRendering() {
  if (animationFrameId !== null) return
  lastFrameTime = performance.now() / 1000
  fpsThreshold = 0
  animationFrameId = requestAnimationFrame(render)
}

function stopRendering() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

function render() {
  animationFrameId = requestAnimationFrame(render)
  
  const now = performance.now() / 1000
  const dt = Math.min(now - lastFrameTime, 1)
  lastFrameTime = now
  
  if (store.fpsLimit > 0) {
    fpsThreshold += dt
    if (fpsThreshold < 1.0 / store.fpsLimit) {
      return
    }
    fpsThreshold -= 1.0 / store.fpsLimit
  }
  
  drawCircle()
}

function drawCircle() {
  if (!ctx || !canvasRef.value) return
  
  const width = canvasRef.value.width
  const height = canvasRef.value.height
  
  ctx.clearRect(0, 0, width, height)
  
  const centerX = width / 2
  const centerY = height / 2
  const barCount = store.state.barCount
  const barWidth = store.state.barWidth
  const baseRadius = Math.min(width, height) * 0.25
  const maxRadius = Math.min(width, height) * 0.45
  
  const barData = getBarData(barCount, false)[0]
  
  const angleStep = (Math.PI * 2) / barCount
  
  for (let i = 0; i < barCount; i++) {
    const angle = i * angleStep - Math.PI / 2
    const amplitude = barData[i]
    const barHeight = amplitude * (maxRadius - baseRadius)
    
    const startX = centerX + Math.cos(angle) * baseRadius
    const startY = centerY + Math.sin(angle) * baseRadius
    const endX = centerX + Math.cos(angle) * (baseRadius + barHeight)
    const endY = centerY + Math.sin(angle) * (baseRadius + barHeight)
    
    const color = getBarColor(i, barCount)
    ctx.strokeStyle = color
    ctx.lineWidth = barWidth
    ctx.lineCap = 'round'
    
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
  }
}

function getBarColor(index: number, total: number): string {
  if (store.state.rainbow) {
    return getRainbowColor(index, total)
  }
  
  if (store.state.gradientEnabled) {
    // For radial, interpolate between gradient colors based on position
    const t = index / total
    const startColor = parseRgbString(store.state.gradientStart)
    const endColor = parseRgbString(store.state.gradientEnd)
    
    const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * t)
    const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * t)
    const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * t)
    
    return `rgba(${r}, ${g}, ${b}, ${store.state.opacity})`
  }
  
  return rgbStringToRgba(store.state.color, store.state.opacity)
}

function parseRgbString(rgb: string): [number, number, number] {
  const parts = rgb.split(' ').map(Number)
  return [parts[0] * 255, parts[1] * 255, parts[2] * 255]
}

function rgbStringToRgba(rgb: string, alpha: number): string {
  const parts = rgb.split(' ').map(Number)
  return `rgba(${parts[0] * 255}, ${parts[1] * 255}, ${parts[2] * 255}, ${alpha})`
}

watch([canvasWidth, canvasHeight], () => {
  stopRendering()
  startRendering()
})
</script>

<style scoped>
canvas {
  display: block;
}
</style>
