import { createApp, type App as VueApp } from 'vue'
import { createPinia } from 'pinia'
import ClockApp from '@/components/ClockApp.vue'
import { useClockStore, DEFAULT_STATE, DEFAULT_PROPERTY_KEYS } from '@/stores/clockStore'
import { hexToRgbString, rgbStringToHex } from '@/utils/colors'
import type { ClockOptions, ClockInstance, WallpaperEngineProperties, ClockPropertyKeys, ClockState } from '@/types'

export { DEFAULT_STATE, DEFAULT_PROPERTY_KEYS }
export type { ClockOptions, ClockInstance, WallpaperEngineProperties, ClockPropertyKeys, ClockState }

export const CLOCK_PROPERTY_KEYS = DEFAULT_PROPERTY_KEYS

export function createClock(options: ClockOptions = {}): ClockInstance {
  const {
    parent = document.body,
    propertyKeys = DEFAULT_PROPERTY_KEYS,
    storageKey = 'clockPosition',
    tickMs = 1000,
    initialState = {}
  } = options

  const container = document.createElement('div')
  container.id = 'clock-root'
  container.style.cssText = 'position: absolute; inset: 0; pointer-events: none;'
  parent.appendChild(container)

  const pinia = createPinia()
  const app: VueApp = createApp(ClockApp)
  app.use(pinia)

  let mounted = false
  let appInstance: any = null

  const instance: ClockInstance = {
    start() {
      if (mounted) return

      appInstance = app.mount(container)
      mounted = true

      const store = useClockStore()
      store.configure({
        storageKey,
        propertyKeys: propertyKeys as Partial<ClockPropertyKeys>,
        initialState: initialState as Partial<ClockState>
      })
      store.loadPosition()
      store.startTicking(tickMs)
    },

    dispose() {
      if (!mounted) return

      const store = useClockStore()
      store.stopTicking()
      app.unmount()
      container.remove()
      mounted = false
    },

    applyProperties(props: WallpaperEngineProperties) {
      const store = useClockStore()
      store.applyProperties(props)
    },

    setPosition(x: number, y: number) {
      const store = useClockStore()
      store.setPosition(x, y)
    },

    getState() {
      const store = useClockStore()
      return store.getState()
    },

    applyEditorVisibility(show: boolean) {
      const store = useClockStore()
      store.editorVisible = show
    },

    toHexColor(rgb: string) {
      return rgbStringToHex(rgb)
    },

    toRgbString(hex: string) {
      return hexToRgbString(hex)
    }
  }

  return instance
}

export default createClock
