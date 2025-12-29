<template>
  <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAudioVisualizerStore } from '@/stores/audioVisualizerStore'
import { useAudioVisualizer } from '@/composables/useAudioVisualizer'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  color: string
}

const store = useAudioVisualizerStore()
const { getBarData, getRainbowColor } = useAudioVisualizer()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationFrameId: number | null = null
let lastFrameTime = 0
let fpsThreshold = 0

const particles = ref<Particle[]>([])

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
  
  drawParticles(dt)
}

function drawParticles(dt: number) {
  if (!ctx || !canvasRef.value) return
  
  const width = canvasRef.value.width
  const height = canvasRef.value.height
  
  // Clear with fade effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  ctx.fillRect(0, 0, width, height)
  
  const barCount = Math.min(32, store.state.barCount)
  const barData = getBarData(barCount, false)[0]
  
  // Generate particles based on audio
  const particlesPerBar = 1
  for (let i = 0; i < barCount; i++) {
    const amplitude = barData[i]
    
    if (amplitude > 0.2) {
      const x = (i / barCount) * width
      const y = height / 2
      
      for (let j = 0; j < particlesPerBar; j++) {
        createParticle(x, y, amplitude, i, barCount)
      }
    }
  }
  
  // Update and draw particles
  particles.value = particles.value.filter(p => {
    p.life -= dt
    
    if (p.life <= 0) return false
    
    p.x += p.vx * dt * 60
    p.y += p.vy * dt * 60
    
    const alpha = (p.life / p.maxLife) * store.state.opacity
    
    ctx!.fillStyle = p.color.replace('1)', `${alpha})`)
    ctx!.beginPath()
    ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx!.fill()
    
    return true
  })
}

function createParticle(x: number, y: number, amplitude: number, index: number, total: number) {
  if (particles.value.length > 500) return
  
  const angle = (Math.random() - 0.5) * Math.PI * 2
  const speed = amplitude * 100 + 50
  
  let color: string
  if (store.state.rainbow) {
    color = getRainbowColor(index, total).replace('60%', '60%').replace(')', ', 1)')
  } else if (store.state.gradientEnabled) {
    const t = index / total
    const startColor = parseRgbString(store.state.gradientStart)
    const endColor = parseRgbString(store.state.gradientEnd)
    
    const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * t)
    const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * t)
    const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * t)
    
    color = `rgba(${r}, ${g}, ${b}, 1)`
  } else {
    color = rgbStringToRgba(store.state.color, 1)
  }
  
  particles.value.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 50,
    size: amplitude * 4 + 2,
    life: 1 + amplitude,
    maxLife: 1 + amplitude,
    color
  })
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
  particles.value = []
  startRendering()
})
</script>

<style scoped>
canvas {
  display: block;
  background: #000;
}
</style>
