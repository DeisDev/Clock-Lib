import { createApp } from 'vue'
import { createPinia } from 'pinia'
import DebugApp from './DebugApp.vue'
import ClockWidget from './components/ClockWidget.vue'

const pinia = createPinia()

const app = createApp(DebugApp)
app.use(pinia)
app.component('ClockWidget', ClockWidget)
app.mount('#app')
