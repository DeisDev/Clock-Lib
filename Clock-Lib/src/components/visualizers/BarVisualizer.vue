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
  
  // FPS limiting based on Wallpaper Engine settings
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
  
  drawBars()
}

function drawBars() {
  if (!ctx || !canvasRef.value) return
  
  const width = canvasRef.value.width
  const height = canvasRef.value.height
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height)
  
  const barCount = store.state.barCount
  const barGap = store.state.barGap
  const barRadius = store.state.barRadius
  const mirror = store.state.mirror
  const stereo = store.state.stereo
  
  const barData = getBarData(barCount, stereo)
  
  if (stereo) {
    // Stereo mode: left channel on left, right channel on right (mirrored)
    drawStereoBar(barData[0], barData[1], width, height, barCount, barGap, barRadius)
  } else if (mirror) {
    // Mirror mode: same data mirrored vertically
    drawMirroredBars(barData[0], width, height, barCount, barGap, barRadius)
  } else {
    // Standard mode: single row of bars
    drawStandardBars(barData[0], width, height, barCount, barGap, barRadius)
  }
}

function drawStandardBars(
  data: number[],
  width: number,
  height: number,
  barCount: number,
  barGap: number,
  barRadius: number
) {
  if (!ctx) return
  
  const totalGap = barGap * (barCount - 1)
  const barWidth = (width - totalGap) / barCount
  
  for (let i = 0; i < barCount; i++) {
    const barHeight = Math.max(2, data[i] * height)
    const x = i * (barWidth + barGap)
    const y = height - barHeight
    
    const color = getBarColor(i, barCount)
    ctx.fillStyle = color
    
    if (barRadius > 0) {
      drawRoundedRect(ctx, x, y, barWidth, barHeight, barRadius)
    } else {
      ctx.fillRect(x, y, barWidth, barHeight)
    }
  }
}

function drawMirroredBars(
  data: number[],
  width: number,
  height: number,
  barCount: number,
  barGap: number,
  barRadius: number
) {
  if (!ctx) return
  
  const totalGap = barGap * (barCount - 1)
  const barWidth = (width - totalGap) / barCount
  const centerY = height / 2
  
  for (let i = 0; i < barCount; i++) {
    const barHeight = Math.max(2, data[i] * (height / 2))
    const x = i * (barWidth + barGap)
    
    const color = getBarColor(i, barCount)
    ctx.fillStyle = color
    
    // Top half (going up)
    if (barRadius > 0) {
      drawRoundedRect(ctx, x, centerY - barHeight, barWidth, barHeight, barRadius)
      drawRoundedRect(ctx, x, centerY, barWidth, barHeight, barRadius)
    } else {
      ctx.fillRect(x, centerY - barHeight, barWidth, barHeight)
      ctx.fillRect(x, centerY, barWidth, barHeight)
    }
  }
}

function drawStereoBar(
  leftData: number[],
  rightData: number[],
  width: number,
  height: number,
  barCount: number,
  barGap: number,
  barRadius: number
) {
  if (!ctx) return
  
  const totalGap = barGap * (barCount - 1)
  const barWidth = (width - totalGap) / barCount
  const centerY = height / 2
  
  for (let i = 0; i < barCount; i++) {
    const leftBarHeight = Math.max(2, leftData[i] * (height / 2))
    const rightBarHeight = Math.max(2, rightData[i] * (height / 2))
    const x = i * (barWidth + barGap)
    
    const color = getBarColor(i, barCount)
    ctx.fillStyle = color
    
    // Left channel (top half, going up)
    if (barRadius > 0) {
      drawRoundedRect(ctx, x, centerY - leftBarHeight, barWidth, leftBarHeight, barRadius)
      // Right channel (bottom half, going down)
      drawRoundedRect(ctx, x, centerY, barWidth, rightBarHeight, barRadius)
    } else {
      ctx.fillRect(x, centerY - leftBarHeight, barWidth, leftBarHeight)
      ctx.fillRect(x, centerY, barWidth, rightBarHeight)
    }
  }
}

function getBarColor(index: number, total: number): string {
  if (store.state.rainbow) {
    return getRainbowColor(index, total)
  }
  
  if (store.state.gradientEnabled) {
    // Create gradient for this bar
    if (!ctx || !canvasRef.value) return store.visualizerColor
    
    const gradient = ctx.createLinearGradient(
      0,
      0,
      Math.cos((store.state.gradientAngle * Math.PI) / 180) * canvasRef.value.height,
      Math.sin((store.state.gradientAngle * Math.PI) / 180) * canvasRef.value.height
    )
    
    const startColor = rgbStringToRgba(store.state.gradientStart, 1)
    const endColor = rgbStringToRgba(store.state.gradientEnd, 1)
    
    gradient.addColorStop(0, startColor)
    gradient.addColorStop(1, endColor)
    
    return gradient as any
  }
  
  return store.visualizerColor
}

function rgbStringToRgba(rgb: string, alpha: number): string {
  const parts = rgb.split(' ').map(Number)
  return `rgba(${parts[0] * 255}, ${parts[1] * 255}, ${parts[2] * 255}, ${alpha})`
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2)
  
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.arcTo(x + width, y, x + width, y + r, r)
  ctx.lineTo(x + width, y + height - r)
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r)
  ctx.lineTo(x + r, y + height)
  ctx.arcTo(x, y + height, x, y + height - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
  ctx.fill()
}

// Watch for dimension changes and restart rendering
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
