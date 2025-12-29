<template>
  <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAudioVisualizerStore } from '@/stores/audioVisualizerStore'
import { useAudioVisualizer } from '@/composables/useAudioVisualizer'

const store = useAudioVisualizerStore()
const { getBarData } = useAudioVisualizer()

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
  
  drawWave()
}

function drawWave() {
  if (!ctx || !canvasRef.value) return
  
  const width = canvasRef.value.width
  const height = canvasRef.value.height
  
  ctx.clearRect(0, 0, width, height)
  
  const barCount = store.state.barCount
  const stereo = store.state.stereo
  const mirror = store.state.mirror
  const lineWidth = Math.max(1, store.state.barWidth)
  
  const barData = getBarData(barCount, stereo)
  
  ctx.lineWidth = lineWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  
  if (stereo) {
    drawStereoWave(barData[0], barData[1], width, height, barCount)
  } else if (mirror) {
    drawMirroredWave(barData[0], width, height, barCount)
  } else {
    drawStandardWave(barData[0], width, height, barCount)
  }
}

function drawStandardWave(data: number[], width: number, height: number, barCount: number) {
  if (!ctx) return
  
  const centerY = height / 2
  const stepX = width / (barCount - 1)
  
  // Apply gradient or solid color
  if (store.state.gradientEnabled) {
    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    const startColor = rgbStringToRgba(store.state.gradientStart, store.state.opacity)
    const endColor = rgbStringToRgba(store.state.gradientEnd, store.state.opacity)
    gradient.addColorStop(0, startColor)
    gradient.addColorStop(1, endColor)
    ctx.strokeStyle = gradient
  } else {
    ctx.strokeStyle = store.visualizerColor
  }
  
  ctx.beginPath()
  
  for (let i = 0; i < barCount; i++) {
    const x = i * stepX
    const amplitude = data[i] * (height / 2)
    const y = centerY + (amplitude - height / 4)
    
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  
  ctx.stroke()
}

function drawMirroredWave(data: number[], width: number, height: number, barCount: number) {
  if (!ctx) return
  
  const centerY = height / 2
  const stepX = width / (barCount - 1)
  
  if (store.state.gradientEnabled) {
    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    const startColor = rgbStringToRgba(store.state.gradientStart, store.state.opacity)
    const endColor = rgbStringToRgba(store.state.gradientEnd, store.state.opacity)
    gradient.addColorStop(0, startColor)
    gradient.addColorStop(1, endColor)
    ctx.strokeStyle = gradient
  } else {
    ctx.strokeStyle = store.visualizerColor
  }
  
  // Top wave
  ctx.beginPath()
  for (let i = 0; i < barCount; i++) {
    const x = i * stepX
    const amplitude = data[i] * (height / 4)
    const y = centerY - amplitude
    
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()
  
  // Bottom wave (mirrored)
  ctx.beginPath()
  for (let i = 0; i < barCount; i++) {
    const x = i * stepX
    const amplitude = data[i] * (height / 4)
    const y = centerY + amplitude
    
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()
}

function drawStereoWave(
  leftData: number[],
  rightData: number[],
  width: number,
  height: number,
  barCount: number
) {
  if (!ctx) return
  
  const centerY = height / 2
  const stepX = width / (barCount - 1)
  
  // Left channel (top)
  ctx.strokeStyle = 'rgba(255, 100, 100, ' + store.state.opacity + ')'
  ctx.beginPath()
  for (let i = 0; i < barCount; i++) {
    const x = i * stepX
    const amplitude = leftData[i] * (height / 4)
    const y = centerY - amplitude - height / 8
    
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()
  
  // Right channel (bottom)
  ctx.strokeStyle = 'rgba(100, 100, 255, ' + store.state.opacity + ')'
  ctx.beginPath()
  for (let i = 0; i < barCount; i++) {
    const x = i * stepX
    const amplitude = rightData[i] * (height / 4)
    const y = centerY + amplitude + height / 8
    
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()
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
