import { ref, onMounted, onUnmounted } from 'vue'

export function useFps() {
  const fps = ref(0)
  const avgFps = ref(0)
  
  let lastTimestamp = 0
  let samples: number[] = []
  let frameId: number | null = null
  
  function tick(timestamp: number) {
    if (lastTimestamp) {
      const dt = Math.max(1, timestamp - lastTimestamp)
      const currentFps = 1000 / dt
      
      samples.push(currentFps)
      if (samples.length > 120) samples.shift()
      
      fps.value = Math.round(currentFps * 10) / 10
      avgFps.value = Math.round((samples.reduce((a, b) => a + b, 0) / samples.length) * 10) / 10
    }
    
    lastTimestamp = timestamp
    frameId = requestAnimationFrame(tick)
  }
  
  function start() {
    if (!frameId) {
      frameId = requestAnimationFrame(tick)
    }
  }
  
  function stop() {
    if (frameId) {
      cancelAnimationFrame(frameId)
      frameId = null
    }
  }
  
  onMounted(start)
  onUnmounted(stop)
  
  return {
    fps,
    avgFps,
    start,
    stop
  }
}
