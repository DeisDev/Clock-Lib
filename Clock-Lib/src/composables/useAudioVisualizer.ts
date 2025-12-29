import { ref, onMounted, onUnmounted } from 'vue'
import { useAudioVisualizerStore } from '@/stores/audioVisualizerStore'

export interface AudioData {
  left: number[]
  right: number[]
  combined: number[]
}

export function useAudioVisualizer() {
  const store = useAudioVisualizerStore()
  const audioData = ref<AudioData>({
    left: new Array(64).fill(0),
    right: new Array(64).fill(0),
    combined: new Array(64).fill(0)
  })
  
  const smoothedData = ref<AudioData>({
    left: new Array(64).fill(0),
    right: new Array(64).fill(0),
    combined: new Array(64).fill(0)
  })
  
  const peakData = ref<AudioData>({
    left: new Array(64).fill(0),
    right: new Array(64).fill(0),
    combined: new Array(64).fill(0)
  })
  
  const isWallpaperEngine = ref(false)
  let audioListenerRegistered = false
  
  // Check if running in Wallpaper Engine
  onMounted(() => {
    isWallpaperEngine.value = typeof window.wallpaperRegisterAudioListener === 'function'
    
    if (isWallpaperEngine.value && !audioListenerRegistered) {
      registerWallpaperEngineAudioListener()
    }
  })
  
  function registerWallpaperEngineAudioListener() {
    if (audioListenerRegistered) return
    
    // Register the audio listener with Wallpaper Engine
    window.wallpaperRegisterAudioListener?.(handleWallpaperEngineAudio)
    audioListenerRegistered = true
  }
  
  function handleWallpaperEngineAudio(audioArray: number[]) {
    if (!audioArray || audioArray.length !== 128) return
    
    // Extract left (0-63) and right (64-127) channels
    const left = audioArray.slice(0, 64)
    const right = audioArray.slice(64, 128)
    
    // Apply sensitivity
    const sensitivity = store.state.sensitivity
    const processedLeft = left.map(v => Math.min(v * sensitivity, 1))
    const processedRight = right.map(v => Math.min(v * sensitivity, 1))
    
    // Combine channels (average)
    const combined = processedLeft.map((v, i) => (v + processedRight[i]) / 2)
    
    // Apply frequency range filtering
    const minFreq = Math.floor(store.state.minFrequency)
    const maxFreq = Math.ceil(store.state.maxFrequency)
    
    audioData.value = {
      left: processedLeft.slice(minFreq, maxFreq),
      right: processedRight.slice(minFreq, maxFreq),
      combined: combined.slice(minFreq, maxFreq)
    }
    
    // Apply smoothing
    applySmoothing()
    
    // Apply peak hold if enabled
    if (store.state.peakHold) {
      applyPeakHold()
    }
  }
  
  function applySmoothing() {
    const smoothing = store.state.smoothing
    
    smoothedData.value.left = smoothedData.value.left.map((v, i) => 
      v * smoothing + audioData.value.left[i] * (1 - smoothing)
    )
    
    smoothedData.value.right = smoothedData.value.right.map((v, i) => 
      v * smoothing + audioData.value.right[i] * (1 - smoothing)
    )
    
    smoothedData.value.combined = smoothedData.value.combined.map((v, i) => 
      v * smoothing + audioData.value.combined[i] * (1 - smoothing)
    )
  }
  
  function applyPeakHold() {
    const decay = store.state.decayRate
    
    peakData.value.left = peakData.value.left.map((peak, i) => {
      const current = smoothedData.value.left[i]
      return current > peak ? current : peak * decay
    })
    
    peakData.value.right = peakData.value.right.map((peak, i) => {
      const current = smoothedData.value.right[i]
      return current > peak ? current : peak * decay
    })
    
    peakData.value.combined = peakData.value.combined.map((peak, i) => {
      const current = smoothedData.value.combined[i]
      return current > peak ? current : peak * decay
    })
  }
  
  function getProcessedAudioData(): AudioData {
    if (store.state.peakHold) {
      return peakData.value
    }
    return smoothedData.value
  }
  
  function getBarData(barCount: number, stereo: boolean = false): number[][] {
    const data = getProcessedAudioData()
    
    if (stereo) {
      // Return separate left and right channel data
      return [
        resampleData(data.left, barCount),
        resampleData(data.right, barCount)
      ]
    } else {
      // Return combined mono data
      return [resampleData(data.combined, barCount)]
    }
  }
  
  function resampleData(data: number[], targetSize: number): number[] {
    if (data.length === targetSize) return [...data]
    
    const result: number[] = []
    const step = data.length / targetSize
    
    for (let i = 0; i < targetSize; i++) {
      const start = Math.floor(i * step)
      const end = Math.floor((i + 1) * step)
      const slice = data.slice(start, end)
      const avg = slice.reduce((sum, v) => sum + v, 0) / slice.length
      result.push(avg)
    }
    
    return result
  }
  
  function getRainbowColor(index: number, total: number): string {
    const hue = (index / total) * 360
    return `hsl(${hue}, 100%, 60%)`
  }
  
  onUnmounted(() => {
    // Note: Wallpaper Engine doesn't provide an unregister function
    // The listener will stop being called when the page unloads
  })
  
  return {
    audioData: smoothedData,
    peakData,
    isWallpaperEngine,
    getProcessedAudioData,
    getBarData,
    getRainbowColor,
    registerWallpaperEngineAudioListener
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    wallpaperRegisterAudioListener?: (callback: (audioArray: number[]) => void) => void
  }
}
