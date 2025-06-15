import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  base: '/',
  build: {
    sourcemap: true
  },
  server: {
    sourcemapIgnoreList: false,
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    force: true
  }
})
