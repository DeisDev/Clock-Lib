import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    dts({ 
      insertTypesEntry: true,
      rollupTypes: true 
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/clock.ts'),
      name: 'ClockLib',
      fileName: 'clock',
      formats: ['es']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        assetFileNames: 'clock.[ext]'
      }
    },
    cssCodeSplit: false,
    minify: 'esbuild',
    sourcemap: true
  },
  server: {
    port: 3000,
    cors: true,
    hmr: {
      overlay: true
    }
  },
  publicDir: 'public'
})
