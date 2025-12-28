import { ref, onUnmounted } from 'vue'

export interface DragState {
  active: boolean
  startX: number
  startY: number
  baseX: number
  baseY: number
}

export function useDraggable(options: {
  initialX?: number
  initialY?: number
  onMove?: (x: number, y: number) => void
  onEnd?: (x: number, y: number) => void
  enabled?: () => boolean
}) {
  const posX = ref(options.initialX ?? 0.5)
  const posY = ref(options.initialY ?? 0.5)
  const isDragging = ref(false)
  
  const dragState: DragState = {
    active: false,
    startX: 0,
    startY: 0,
    baseX: 0.5,
    baseY: 0.5
  }
  
  function clamp01(v: number): number {
    return Math.max(0, Math.min(1, v))
  }
  
  function onPointerDown(e: PointerEvent) {
    if (options.enabled && !options.enabled()) return
    
    dragState.active = true
    dragState.startX = e.clientX
    dragState.startY = e.clientY
    dragState.baseX = posX.value
    dragState.baseY = posY.value
    isDragging.value = true
    
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  }
  
  function onPointerMove(e: PointerEvent) {
    if (!dragState.active) return
    
    const dx = e.clientX - dragState.startX
    const dy = e.clientY - dragState.startY
    const relX = dx / window.innerWidth
    const relY = dy / window.innerHeight
    
    posX.value = clamp01(dragState.baseX + relX)
    posY.value = clamp01(dragState.baseY + relY)
    
    options.onMove?.(posX.value, posY.value)
  }
  
  function onPointerUp() {
    if (!dragState.active) return
    
    dragState.active = false
    isDragging.value = false
    
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
    
    options.onEnd?.(posX.value, posY.value)
  }
  
  function setPosition(x: number, y: number) {
    posX.value = clamp01(x)
    posY.value = clamp01(y)
  }
  
  function centerHorizontally() {
    setPosition(0.5, posY.value)
    options.onEnd?.(posX.value, posY.value)
  }
  
  function centerVertically() {
    setPosition(posX.value, 0.5)
    options.onEnd?.(posX.value, posY.value)
  }
  
  onUnmounted(() => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
  })
  
  return {
    posX,
    posY,
    isDragging,
    onPointerDown,
    setPosition,
    centerHorizontally,
    centerVertically
  }
}

export function usePanelDraggable(element: () => HTMLElement | null) {
  const offsetX = ref(0)
  const offsetY = ref(0)
  const isDragging = ref(false)
  
  let dragState = {
    active: false,
    startX: 0,
    startY: 0,
    baseX: 0,
    baseY: 0
  }
  
  function onPointerDown(e: PointerEvent) {
    const el = element()
    if (!el) return
    
    const rect = el.getBoundingClientRect()
    dragState = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      baseX: rect.left,
      baseY: rect.top
    }
    isDragging.value = true
    
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  }
  
  function onPointerMove(e: PointerEvent) {
    if (!dragState.active) return
    
    const el = element()
    if (!el) return
    
    const dx = e.clientX - dragState.startX
    const dy = e.clientY - dragState.startY
    
    el.style.left = `${dragState.baseX + dx}px`
    el.style.top = `${dragState.baseY + dy}px`
    el.style.right = 'auto'
    el.style.transform = 'none'
  }
  
  function onPointerUp() {
    dragState.active = false
    isDragging.value = false
    
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
  }
  
  onUnmounted(() => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
  })
  
  return {
    offsetX,
    offsetY,
    isDragging,
    onPointerDown
  }
}
